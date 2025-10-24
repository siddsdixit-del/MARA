package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
}

// Message types
type MessageType string

const (
	WorkloadUpdate   MessageType = "workload_update"
	ResourceUpdate   MessageType = "resource_update"
	MetricsUpdate    MessageType = "metrics_update"
	AlertUpdate      MessageType = "alert_update"
	BillingUpdate    MessageType = "billing_update"
	SystemEvent      MessageType = "system_event"
)

// WebSocket message
type WSMessage struct {
	Type      MessageType     `json:"type"`
	Timestamp time.Time       `json:"timestamp"`
	Data      json.RawMessage `json:"data"`
}

// Client represents a connected WebSocket client
type Client struct {
	ID          string
	Conn        *websocket.Conn
	Send        chan *WSMessage
	UserID      string
	Role        string
	Subscriptions map[MessageType]bool
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan *WSMessage
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
	logger     *zap.Logger
}

// Metrics tracking (simplified)
var (
	wsConnectionCount int
	wsMessageCount    int
)

func NewHub(logger *zap.Logger) *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan *WSMessage, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		logger:     logger,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			wsConnectionCount++
			h.logger.Info("Client connected",
				zap.String("client_id", client.ID),
				zap.String("role", client.Role),
			)

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				h.mu.Lock()
				delete(h.clients, client)
				close(client.Send)
				h.mu.Unlock()
				wsConnectionCount--
				h.logger.Info("Client disconnected",
					zap.String("client_id", client.ID),
				)
			}

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				// Check if client is subscribed to this message type
				if client.Subscriptions[message.Type] {
					select {
					case client.Send <- message:
						wsMessageCount++
					default:
						// Client's send channel is full, disconnect
						close(client.Send)
						delete(h.clients, client)
					}
				}
			}
			h.mu.RUnlock()
		}
	}
}

// Broadcast sends a message to all subscribed clients
func (h *Hub) Broadcast(msgType MessageType, data interface{}) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	message := &WSMessage{
		Type:      msgType,
		Timestamp: time.Now(),
		Data:      jsonData,
	}

	h.broadcast <- message
	return nil
}

// WebSocket handler
func (h *Hub) handleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		h.logger.Error("Failed to upgrade connection", zap.Error(err))
		return
	}

	// Get user info from query params or headers (in production, validate JWT)
	userID := c.Query("user_id")
	role := c.Query("role")
	if role == "" {
		role = "customer"
	}

	client := &Client{
		ID:     fmt.Sprintf("client-%d", time.Now().UnixNano()),
		Conn:   conn,
		Send:   make(chan *WSMessage, 256),
		UserID: userID,
		Role:   role,
		Subscriptions: map[MessageType]bool{
			WorkloadUpdate: true,
			ResourceUpdate: true,
			MetricsUpdate:  true,
			AlertUpdate:    true,
			BillingUpdate:  true,
			SystemEvent:    true,
		},
	}

	h.register <- client

	// Start goroutines for reading and writing
	go client.writePump()
	go client.readPump(h)
}

func (c *Client) readPump(h *Hub) {
	defer func() {
		h.unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		// Handle subscription updates
		var sub struct {
			Action string      `json:"action"` // subscribe, unsubscribe
			Type   MessageType `json:"type"`
		}
		if err := json.Unmarshal(message, &sub); err == nil {
			if sub.Action == "subscribe" {
				c.Subscriptions[sub.Type] = true
			} else if sub.Action == "unsubscribe" {
				c.Subscriptions[sub.Type] = false
			}
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			json.NewEncoder(w).Encode(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// WebSocket Service
type WebSocketService struct {
	hub        *Hub
	logger     *zap.Logger
	httpServer *http.Server
	version    string
}

func NewWebSocketService() *WebSocketService {
	logger, _ := zap.NewProduction()
	hub := NewHub(logger)

	service := &WebSocketService{
		hub:     hub,
		logger:  logger,
		version: "1.0.0",
	}

	// Start hub
	go hub.Run()

	// Start simulator for demo
	go service.simulateUpdates()

	return service
}

func (ws *WebSocketService) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.GET("/health", ws.handleHealth)
	router.GET("/metrics", ws.handleMetrics)
	router.GET("/ws", ws.hub.handleWebSocket)

	ws.httpServer = &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	ws.logger.Info("Starting WebSocket Service",
		zap.String("port", port),
		zap.String("version", ws.version),
	)

	return ws.httpServer.ListenAndServe()
}

func (ws *WebSocketService) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":      "healthy",
		"service":     "websocket",
		"version":     ws.version,
		"connections": len(ws.hub.clients),
	})
}

func (ws *WebSocketService) handleMetrics(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"connections": wsConnectionCount,
		"messages":    wsMessageCount,
	})
}

// Simulate real-time updates for demo
func (ws *WebSocketService) simulateUpdates() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		// Simulate workload update
		ws.hub.Broadcast(WorkloadUpdate, map[string]interface{}{
			"workload_id": fmt.Sprintf("wl-%d", time.Now().Unix()),
			"status":      "running",
			"progress":    75,
		})

		// Simulate metrics update
		ws.hub.Broadcast(MetricsUpdate, map[string]interface{}{
			"gpu_utilization":  85.5,
			"asic_utilization": 92.3,
			"power_usage":      1250.0,
			"revenue_usd":      1580.50,
		})

		// Occasional alert
		if time.Now().Unix()%20 == 0 {
			ws.hub.Broadcast(AlertUpdate, map[string]interface{}{
				"severity": "warning",
				"message":  "GPU temperature above 75°C",
				"resource": "gpu-tx-001",
			})
		}
	}
}

func main() {
	service := NewWebSocketService()

	port := "8086"
	if err := service.Start(port); err != nil && err != http.ErrServerClosed {
		fmt.Printf("Failed to start websocket service: %v\n", err)
	}
}

