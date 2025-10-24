package main

import (
	"container/list"
	"context"
	"fmt"
	"log"
	_ "math/rand" // For future randomization features
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
)

// Metrics
var (
	workloadsQueued = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "router_workloads_queued_total",
			Help: "Total workloads queued",
		},
		[]string{"priority", "workload_type"},
	)

	queueDepth = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "router_queue_depth",
			Help: "Current queue depth by priority",
		},
		[]string{"priority"},
	)

	routingDecisions = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "router_decision_duration_seconds",
			Help:    "Time to make routing decision",
			Buckets: prometheus.ExponentialBuckets(0.0001, 2, 15),
		},
		[]string{"workload_type"},
	)
)

// Workload represents a workload to be routed
type Workload struct {
	ID           string                 `json:"id"`
	CustomerID   string                 `json:"customer_id"`
	Type         string                 `json:"type"`
	Priority     int                    `json:"priority"`
	Requirements map[string]interface{} `json:"requirements"`
	Status       string                 `json:"status"`
	CreatedAt    time.Time              `json:"created_at"`
}

// PriorityQueue implements a multi-level priority queue
type PriorityQueue struct {
	queues  map[int]*list.List
	mu      sync.RWMutex
	cond    *sync.Cond
	maxSize int
}

func NewPriorityQueue(maxSize int) *PriorityQueue {
	pq := &PriorityQueue{
		queues:  make(map[int]*list.List),
		maxSize: maxSize,
	}
	pq.cond = sync.NewCond(&pq.mu)

	// Initialize queues for priorities 1-10
	for i := 1; i <= 10; i++ {
		pq.queues[i] = list.New()
	}

	return pq
}

func (pq *PriorityQueue) Enqueue(workload *Workload) error {
	pq.mu.Lock()
	defer pq.mu.Unlock()

	if pq.size() >= pq.maxSize {
		return fmt.Errorf("queue is full")
	}

	queue := pq.queues[workload.Priority]
	queue.PushBack(workload)

	// Update metrics
	workloadsQueued.WithLabelValues(
		fmt.Sprintf("%d", workload.Priority),
		workload.Type,
	).Inc()
	queueDepth.WithLabelValues(fmt.Sprintf("%d", workload.Priority)).Inc()

	pq.cond.Signal()
	return nil
}

func (pq *PriorityQueue) Dequeue(ctx context.Context) (*Workload, error) {
	pq.mu.Lock()
	defer pq.mu.Unlock()

	for {
		// Try to dequeue from highest priority queue
		for priority := 1; priority <= 10; priority++ {
			queue := pq.queues[priority]
			if queue.Len() > 0 {
				element := queue.Front()
				queue.Remove(element)
				queueDepth.WithLabelValues(fmt.Sprintf("%d", priority)).Dec()
				return element.Value.(*Workload), nil
			}
		}

		// No workloads, wait
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
			pq.cond.Wait()
		}
	}
}

func (pq *PriorityQueue) size() int {
	total := 0
	for _, queue := range pq.queues {
		total += queue.Len()
	}
	return total
}

func (pq *PriorityQueue) GetQueueDepths() map[int]int {
	pq.mu.RLock()
	defer pq.mu.RUnlock()

	depths := make(map[int]int)
	for priority, queue := range pq.queues {
		depths[priority] = queue.Len()
	}
	return depths
}

// WorkloadRouter main service
type WorkloadRouter struct {
	logger      *zap.Logger
	queue       *PriorityQueue
	httpServer  *http.Server
	version     string
}

func NewWorkloadRouter() *WorkloadRouter {
	logger, _ := zap.NewProduction()

	return &WorkloadRouter{
		logger:  logger,
		queue:   NewPriorityQueue(10000),
		version: "1.0.0",
	}
}

func (wr *WorkloadRouter) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.GET("/health", wr.handleHealth)
	router.GET("/ready", wr.handleReady)
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Direct endpoints (for easier testing)
	router.POST("/submit", wr.handleRouteWorkload)
	router.GET("/queue", wr.handleGetQueueStatus)
	router.GET("/queue/depth", wr.handleGetQueueDepth)

	v1 := router.Group("/api/v1")
	{
		v1.POST("/route", wr.handleRouteWorkload)
		v1.POST("/submit", wr.handleRouteWorkload)  // Alias for /route
		v1.GET("/queue/depth", wr.handleGetQueueDepth)
		v1.GET("/queue/status", wr.handleGetQueueStatus)
		v1.GET("/queue", wr.handleGetQueueStatus)
		v1.POST("/workload/classify", wr.handleClassifyWorkload)
	}

	wr.httpServer = &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	wr.logger.Info("Starting Workload Router",
		zap.String("port", port),
		zap.String("version", wr.version),
	)

	return wr.httpServer.ListenAndServe()
}

func (wr *WorkloadRouter) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "workload-router",
		"version": wr.version,
	})
}

func (wr *WorkloadRouter) handleReady(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ready"})
}

func (wr *WorkloadRouter) handleRouteWorkload(c *gin.Context) {
	var req Workload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start := time.Now()

	// Assign ID and timestamp
	req.ID = uuid.New().String()
	req.CreatedAt = time.Now()
	req.Status = "queued"

	// Classify and prioritize
	wr.classifyWorkload(&req)

	// Enqueue
	if err := wr.queue.Enqueue(&req); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	routingDecisions.WithLabelValues(req.Type).Observe(time.Since(start).Seconds())

	wr.logger.Info("Workload routed",
		zap.String("workload_id", req.ID),
		zap.String("type", req.Type),
		zap.Int("priority", req.Priority),
	)

	c.JSON(http.StatusOK, gin.H{
		"workload_id":    req.ID,
		"status":         req.Status,
		"priority":       req.Priority,
		"queue_position": wr.estimateQueuePosition(&req),
	})
}

func (wr *WorkloadRouter) classifyWorkload(w *Workload) {
	// Simple classification logic
	if w.Priority == 0 {
		switch w.Type {
		case "ai_inference_realtime":
			w.Priority = 1
		case "model_training":
			w.Priority = 2
		case "ai_inference_batch":
			w.Priority = 3
		case "bitcoin_mining":
			w.Priority = 4
		default:
			w.Priority = 5
		}
	}
}

func (wr *WorkloadRouter) estimateQueuePosition(w *Workload) int {
	depths := wr.queue.GetQueueDepths()
	position := 0

	for priority := 1; priority < w.Priority; priority++ {
		position += depths[priority]
	}

	return position + depths[w.Priority]
}

func (wr *WorkloadRouter) handleGetQueueDepth(c *gin.Context) {
	depths := wr.queue.GetQueueDepths()

	total := 0
	for _, depth := range depths {
		total += depth
	}

	c.JSON(http.StatusOK, gin.H{
		"total_depth":     total,
		"by_priority":     depths,
		"max_queue_size":  wr.queue.maxSize,
		"utilization_pct": float64(total) / float64(wr.queue.maxSize) * 100,
	})
}

func (wr *WorkloadRouter) handleGetQueueStatus(c *gin.Context) {
	depths := wr.queue.GetQueueDepths()

	c.JSON(http.StatusOK, gin.H{
		"queue_depths": depths,
		"timestamp":    time.Now(),
	})
}

func (wr *WorkloadRouter) handleClassifyWorkload(c *gin.Context) {
	var req struct {
		Type         string                 `json:"type"`
		CustomerTier string                 `json:"customer_tier"`
		Requirements map[string]interface{} `json:"requirements"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	w := &Workload{Type: req.Type}
	wr.classifyWorkload(w)

	c.JSON(http.StatusOK, gin.H{
		"workload_type":     req.Type,
		"assigned_priority": w.Priority,
		"estimated_latency": "< 1 second",
	})
}

func main() {
	service := NewWorkloadRouter()

	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8082"
		}

		if err := service.Start(port); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Workload Router stopped")
}

