package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
)

// Prometheus metrics
var (
	allocationsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "orchestrator_allocations_total",
			Help: "Total number of resource allocations",
		},
		[]string{"resource_type", "status"},
	)

	allocationDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name: "orchestrator_allocation_duration_seconds",
			Help: "Duration of allocation operations",
			Buckets: prometheus.ExponentialBuckets(0.001, 2, 15),
		},
		[]string{"resource_type"},
	)

	activeWorkloads = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "orchestrator_active_workloads",
			Help: "Number of currently active workloads",
		},
	)
)

// OrchestratorService is the main service struct
type OrchestratorService struct {
	logger     *zap.Logger
	httpServer *http.Server
	version    string
}

// WorkloadRequest represents a workload submission request
type WorkloadRequest struct {
	CustomerID   string                 `json:"customer_id" binding:"required"`
	WorkloadType string                 `json:"workload_type" binding:"required"`
	Priority     int                    `json:"priority" binding:"required,min=1,max=10"`
	Requirements map[string]interface{} `json:"requirements" binding:"required"`
}

// WorkloadResponse represents the response after workload submission
type WorkloadResponse struct {
	WorkloadID     string    `json:"workload_id"`
	Status         string    `json:"status"`
	Priority       int       `json:"priority"`
	QueuePosition  int       `json:"queue_position"`
	EstimatedStart time.Time `json:"estimated_start"`
	CreatedAt      time.Time `json:"created_at"`
}

// AllocationRequest represents a resource allocation request
type AllocationRequest struct {
	WorkloadID       string   `json:"workload_id" binding:"required"`
	ResourceIDs      []string `json:"resource_ids" binding:"required"`
	AllocationPeriod string   `json:"allocation_period"`
}

// NewOrchestratorService creates a new orchestrator service
func NewOrchestratorService() *OrchestratorService {
	logger, _ := zap.NewProduction()
	
	return &OrchestratorService{
		logger:  logger,
		version: "1.0.0",
	}
}

// Start starts the HTTP server
func (s *OrchestratorService) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// Health check endpoints
	router.GET("/health", s.handleHealth)
	router.GET("/ready", s.handleReady)

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		v1.POST("/workloads", s.handleSubmitWorkload)
		v1.GET("/workloads/:id", s.handleGetWorkload)
		v1.GET("/workloads", s.handleListWorkloads)
		v1.POST("/allocate", s.handleAllocateResources)
		v1.POST("/release", s.handleReleaseResources)
		v1.GET("/status", s.handleGetStatus)
	}

	// Metrics endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	s.httpServer = &http.Server{
		Addr:           ":" + port,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	s.logger.Info("Starting Orchestrator Service",
		zap.String("port", port),
		zap.String("version", s.version),
	)

	return s.httpServer.ListenAndServe()
}

// Shutdown gracefully shuts down the server
func (s *OrchestratorService) Shutdown(ctx context.Context) error {
	s.logger.Info("Shutting down Orchestrator Service")
	return s.httpServer.Shutdown(ctx)
}

// Health check handler
func (s *OrchestratorService) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "orchestrator",
		"version": s.version,
		"time":    time.Now().UTC(),
	})
}

// Ready check handler
func (s *OrchestratorService) handleReady(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ready",
		"checks": gin.H{
			"database": "ok",
			"kafka":    "ok",
		},
	})
}

// Submit workload handler
func (s *OrchestratorService) handleSubmitWorkload(c *gin.Context) {
	var req WorkloadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start := time.Now()
	workloadID := uuid.New().String()

	s.logger.Info("Workload submitted",
		zap.String("workload_id", workloadID),
		zap.String("customer_id", req.CustomerID),
		zap.String("type", req.WorkloadType),
		zap.Int("priority", req.Priority),
	)

	// Simulate workload processing
	activeWorkloads.Inc()
	allocationsTotal.WithLabelValues(req.WorkloadType, "queued").Inc()

	response := WorkloadResponse{
		WorkloadID:     workloadID,
		Status:         "queued",
		Priority:       req.Priority,
		QueuePosition:  5, // Simulated
		EstimatedStart: time.Now().Add(2 * time.Minute),
		CreatedAt:      time.Now(),
	}

	allocationDuration.WithLabelValues(req.WorkloadType).Observe(time.Since(start).Seconds())

	c.JSON(http.StatusOK, response)
}

// Get workload handler
func (s *OrchestratorService) handleGetWorkload(c *gin.Context) {
	workloadID := c.Param("id")

	s.logger.Info("Fetching workload", zap.String("workload_id", workloadID))

	// Simulated response
	c.JSON(http.StatusOK, gin.H{
		"workload_id": workloadID,
		"status":      "running",
		"type":        "ai_inference_realtime",
		"priority":    1,
		"created_at":  time.Now().Add(-10 * time.Minute),
		"started_at":  time.Now().Add(-5 * time.Minute),
		"resources": []gin.H{
			{
				"resource_id":   "gpu-001",
				"resource_type": "GPU",
				"model":         "H100",
				"utilization":   87.5,
			},
		},
	})
}

// List workloads handler
func (s *OrchestratorService) handleListWorkloads(c *gin.Context) {
	customerID := c.Query("customer_id")
	status := c.Query("status")

	s.logger.Info("Listing workloads",
		zap.String("customer_id", customerID),
		zap.String("status", status),
	)

	// Simulated response
	c.JSON(http.StatusOK, gin.H{
		"workloads": []gin.H{
			{
				"workload_id": "wl-001",
				"customer_id": customerID,
				"status":      "running",
				"type":        "ai_inference_realtime",
				"priority":    1,
			},
			{
				"workload_id": "wl-002",
				"customer_id": customerID,
				"status":      "queued",
				"type":        "ai_inference_batch",
				"priority":    3,
			},
		},
		"total": 2,
	})
}

// Allocate resources handler
func (s *OrchestratorService) handleAllocateResources(c *gin.Context) {
	var req AllocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start := time.Now()
	allocationID := uuid.New().String()

	s.logger.Info("Allocating resources",
		zap.String("workload_id", req.WorkloadID),
		zap.Int("resource_count", len(req.ResourceIDs)),
	)

	allocationsTotal.WithLabelValues("GPU", "allocated").Inc()
	allocationDuration.WithLabelValues("GPU").Observe(time.Since(start).Seconds())

	c.JSON(http.StatusOK, gin.H{
		"allocation_id": allocationID,
		"workload_id":   req.WorkloadID,
		"resources":     req.ResourceIDs,
		"status":        "active",
		"allocated_at":  time.Now(),
	})
}

// Release resources handler
func (s *OrchestratorService) handleReleaseResources(c *gin.Context) {
	allocationID := c.Query("allocation_id")

	s.logger.Info("Releasing resources", zap.String("allocation_id", allocationID))

	activeWorkloads.Dec()
	allocationsTotal.WithLabelValues("GPU", "released").Inc()

	c.JSON(http.StatusOK, gin.H{
		"allocation_id": allocationID,
		"status":        "released",
		"released_at":   time.Now(),
	})
}

// Get status handler
func (s *OrchestratorService) handleGetStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"service":          "orchestrator",
		"version":          s.version,
		"uptime_seconds":   120, // Simulated
		"active_workloads": 15,  // Simulated
		"queue_depth":      8,   // Simulated
		"total_allocations": 1247, // Simulated
	})
}

func main() {
	service := NewOrchestratorService()

	// Start server in goroutine
	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		
		if err := service.Start(port); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := service.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	fmt.Println("Orchestrator Service stopped")
}

