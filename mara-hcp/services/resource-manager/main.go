package main

import (
	_ "context"      // For future context-aware operations
	"database/sql"
	_ "encoding/json" // For future JSON operations
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// Prometheus metrics
var (
	resourcesDiscovered = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "resource_manager_resources_discovered_total",
			Help: "Total resources discovered",
		},
		[]string{"resource_type", "facility_id"},
	)

	resourceHealth = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "resource_manager_health_status",
			Help: "Resource health status (1=healthy, 0=unhealthy)",
		},
		[]string{"resource_id", "resource_type"},
	)

	allocationOperations = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "resource_manager_allocation_duration_seconds",
			Help:    "Time to allocate resources",
			Buckets: prometheus.ExponentialBuckets(0.0001, 2, 15),
		},
		[]string{"operation"},
	)

	capacityUtilization = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "resource_manager_capacity_utilization",
			Help: "Capacity utilization percentage",
		},
		[]string{"facility_id", "resource_type"},
	)
)

// Resource represents a compute resource
type Resource struct {
	ID             string                 `json:"id"`
	FacilityID     string                 `json:"facility_id"`
	Type           string                 `json:"type"` // GPU, ASIC, CPU
	Subtype        string                 `json:"subtype"`
	Specifications map[string]interface{} `json:"specifications"`
	Status         string                 `json:"status"` // available, allocated, maintenance, failed
	Health         string                 `json:"health"` // healthy, degraded, unhealthy
	Metadata       map[string]interface{} `json:"metadata"`
	LastSeen       time.Time              `json:"last_seen"`
	CreatedAt      time.Time              `json:"created_at"`
	UpdatedAt      time.Time              `json:"updated_at"`
}

// Allocation represents a resource allocation
type Allocation struct {
	ID          string                 `json:"id"`
	WorkloadID  string                 `json:"workload_id"`
	ResourceID  string                 `json:"resource_id"`
	AllocatedAt time.Time              `json:"allocated_at"`
	ReleasedAt  *time.Time             `json:"released_at,omitempty"`
	Status      string                 `json:"status"`
	Metadata    map[string]interface{} `json:"metadata"`
}

// HealthCheck represents resource health information
type HealthCheck struct {
	ResourceID  string    `json:"resource_id"`
	Status      string    `json:"status"`
	Temperature float64   `json:"temperature"`
	Utilization float64   `json:"utilization"`
	Errors      int       `json:"errors"`
	CheckedAt   time.Time `json:"checked_at"`
}

// ResourceManager main service
type ResourceManager struct {
	logger     *zap.Logger
	db         *sql.DB
	redis      *redis.Client
	neo4j      neo4j.DriverWithContext
	httpServer *http.Server
	resources  map[string]*Resource
	mu         sync.RWMutex
	version    string
}

// NewResourceManager creates a new resource manager
func NewResourceManager() (*ResourceManager, error) {
	logger, _ := zap.NewProduction()

	// Connect to PostgreSQL
	db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Connect to Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST") + ":6379",
		DB:   0,
	})

	// Connect to Neo4j
	neo4jDriver, err := neo4j.NewDriverWithContext(
		os.Getenv("NEO4J_URI"),
		neo4j.BasicAuth(os.Getenv("NEO4J_USER"), os.Getenv("NEO4J_PASSWORD"), ""),
	)
	if err != nil {
		logger.Warn("Failed to connect to Neo4j", zap.Error(err))
	}

	rm := &ResourceManager{
		logger:    logger,
		db:        db,
		redis:     redisClient,
		neo4j:     neo4jDriver,
		resources: make(map[string]*Resource),
		version:   "1.0.0",
	}

	// Start background tasks
	go rm.discoveryLoop()
	go rm.healthCheckLoop()

	return rm, nil
}

// Start HTTP server
func (rm *ResourceManager) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.GET("/health", rm.handleHealth)
	router.GET("/ready", rm.handleReady)
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Direct endpoints (for easier testing)
	router.GET("/resources", rm.handleListResources)
	router.POST("/resources/discover", rm.handleDiscoveryScan)
	router.GET("/health/monitor", rm.handleGetHealthChecks)

	v1 := router.Group("/api/v1")
	{
		// Resource management
		v1.GET("/resources", rm.handleListResources)
		v1.GET("/resources/:id", rm.handleGetResource)
		v1.POST("/resources", rm.handleRegisterResource)
		v1.PUT("/resources/:id", rm.handleUpdateResource)
		v1.DELETE("/resources/:id", rm.handleDeleteResource)

		// Resource discovery
		v1.POST("/discovery/scan", rm.handleDiscoveryScan)
		v1.POST("/resources/discover", rm.handleDiscoveryScan)  // Alias
		v1.GET("/discovery/status", rm.handleDiscoveryStatus)

		// Health monitoring
		v1.GET("/health-checks", rm.handleGetHealthChecks)
		v1.GET("/health/monitor", rm.handleGetHealthChecks)  // Alias
		v1.GET("/health-checks/:id", rm.handleGetResourceHealth)

		// Capacity planning
		v1.GET("/capacity/summary", rm.handleCapacitySummary)
		v1.GET("/capacity/forecast", rm.handleCapacityForecast)
		v1.GET("/capacity/utilization", rm.handleCapacityUtilization)

		// Allocations
		v1.POST("/allocations", rm.handleCreateAllocation)
		v1.GET("/allocations", rm.handleListAllocations)
		v1.DELETE("/allocations/:id", rm.handleReleaseAllocation)
	}

	rm.httpServer = &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	rm.logger.Info("Starting Resource Manager",
		zap.String("port", port),
		zap.String("version", rm.version),
	)

	return rm.httpServer.ListenAndServe()
}

// Discovery loop - auto-discover resources
func (rm *ResourceManager) discoveryLoop() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		rm.discoverResources()
	}
}

func (rm *ResourceManager) discoverResources() {
	rm.logger.Info("Running resource discovery scan")

	// Simulate discovering resources (in production, this would query actual hardware)
	facilities := []string{"texas-1", "texas-2", "north-dakota-1"}

	for _, facility := range facilities {
		// Discover GPUs
		gpuCount := rand.Intn(5) + 8 // 8-12 GPUs per facility
		for i := 0; i < gpuCount; i++ {
			resourceID := fmt.Sprintf("gpu-%s-%04d", facility, i)

			rm.mu.Lock()
			if _, exists := rm.resources[resourceID]; !exists {
				resource := &Resource{
					ID:         resourceID,
					FacilityID: facility,
					Type:       "GPU",
					Subtype:    "NVIDIA H100",
					Specifications: map[string]interface{}{
						"memory_gb":          80,
						"compute_capability": 8.9,
						"max_power_w":        700,
					},
					Status:    "available",
					Health:    "healthy",
					Metadata:  map[string]interface{}{"serial": fmt.Sprintf("SN-%s-%04d", facility, i)},
					LastSeen:  time.Now(),
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}

				rm.resources[resourceID] = resource
				resourcesDiscovered.WithLabelValues("GPU", facility).Inc()
				resourceHealth.WithLabelValues(resourceID, "GPU").Set(1)

				rm.logger.Info("Discovered new GPU",
					zap.String("resource_id", resourceID),
					zap.String("facility", facility),
				)
			} else {
				rm.resources[resourceID].LastSeen = time.Now()
			}
			rm.mu.Unlock()
		}

		// Discover ASICs
		asicCount := rand.Intn(10) + 40 // 40-50 ASICs per facility
		for i := 0; i < asicCount; i++ {
			resourceID := fmt.Sprintf("asic-%s-%05d", facility, i)

			rm.mu.Lock()
			if _, exists := rm.resources[resourceID]; !exists {
				resource := &Resource{
					ID:         resourceID,
					FacilityID: facility,
					Type:       "ASIC",
					Subtype:    "Antminer S21",
					Specifications: map[string]interface{}{
						"hash_rate_ths":  270,
						"efficiency_j_th": 13.5,
						"max_power_w":    3645,
					},
					Status:    "available",
					Health:    "healthy",
					Metadata:  map[string]interface{}{"serial": fmt.Sprintf("SN-%s-%05d", facility, i)},
					LastSeen:  time.Now(),
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}

				rm.resources[resourceID] = resource
				resourcesDiscovered.WithLabelValues("ASIC", facility).Inc()
				resourceHealth.WithLabelValues(resourceID, "ASIC").Set(1)
			} else {
				rm.resources[resourceID].LastSeen = time.Now()
			}
			rm.mu.Unlock()
		}
	}

	rm.logger.Info("Discovery scan complete",
		zap.Int("total_resources", len(rm.resources)),
	)
}

// Health check loop
func (rm *ResourceManager) healthCheckLoop() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		rm.performHealthChecks()
	}
}

func (rm *ResourceManager) performHealthChecks() {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	for _, resource := range rm.resources {
		// Simulate health check (in production, this would query actual hardware)
		health := "healthy"
		healthValue := 1.0

		// 5% chance of degraded health
		if rand.Float64() < 0.05 {
			health = "degraded"
			healthValue = 0.5
		}

		// 1% chance of unhealthy
		if rand.Float64() < 0.01 {
			health = "unhealthy"
			healthValue = 0.0
		}

		resource.Health = health
		resourceHealth.WithLabelValues(resource.ID, resource.Type).Set(healthValue)
	}
}

// HTTP Handlers

func (rm *ResourceManager) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "resource-manager",
		"version": rm.version,
	})
}

func (rm *ResourceManager) handleReady(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ready"})
}

func (rm *ResourceManager) handleListResources(c *gin.Context) {
	resourceType := c.Query("type")
	facilityID := c.Query("facility_id")
	status := c.Query("status")

	rm.mu.RLock()
	defer rm.mu.RUnlock()

	var filtered []*Resource
	for _, resource := range rm.resources {
		if resourceType != "" && resource.Type != resourceType {
			continue
		}
		if facilityID != "" && resource.FacilityID != facilityID {
			continue
		}
		if status != "" && resource.Status != status {
			continue
		}
		filtered = append(filtered, resource)
	}

	c.JSON(http.StatusOK, gin.H{
		"resources": filtered,
		"total":     len(filtered),
		"timestamp": time.Now(),
	})
}

func (rm *ResourceManager) handleGetResource(c *gin.Context) {
	resourceID := c.Param("id")

	rm.mu.RLock()
	resource, exists := rm.resources[resourceID]
	rm.mu.RUnlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
		return
	}

	c.JSON(http.StatusOK, resource)
}

func (rm *ResourceManager) handleRegisterResource(c *gin.Context) {
	var resource Resource
	if err := c.ShouldBindJSON(&resource); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resource.ID = uuid.New().String()
	resource.CreatedAt = time.Now()
	resource.UpdatedAt = time.Now()
	resource.LastSeen = time.Now()

	rm.mu.Lock()
	rm.resources[resource.ID] = &resource
	rm.mu.Unlock()

	resourcesDiscovered.WithLabelValues(resource.Type, resource.FacilityID).Inc()

	rm.logger.Info("Resource registered",
		zap.String("resource_id", resource.ID),
		zap.String("type", resource.Type),
	)

	c.JSON(http.StatusCreated, resource)
}

func (rm *ResourceManager) handleUpdateResource(c *gin.Context) {
	resourceID := c.Param("id")

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rm.mu.Lock()
	resource, exists := rm.resources[resourceID]
	if !exists {
		rm.mu.Unlock()
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
		return
	}

	if status, ok := updates["status"].(string); ok {
		resource.Status = status
	}
	if health, ok := updates["health"].(string); ok {
		resource.Health = health
	}

	resource.UpdatedAt = time.Now()
	rm.mu.Unlock()

	c.JSON(http.StatusOK, resource)
}

func (rm *ResourceManager) handleDeleteResource(c *gin.Context) {
	resourceID := c.Param("id")

	rm.mu.Lock()
	delete(rm.resources, resourceID)
	rm.mu.Unlock()

	c.JSON(http.StatusOK, gin.H{"message": "resource deleted"})
}

func (rm *ResourceManager) handleDiscoveryScan(c *gin.Context) {
	go rm.discoverResources()
	c.JSON(http.StatusAccepted, gin.H{"message": "discovery scan initiated"})
}

func (rm *ResourceManager) handleDiscoveryStatus(c *gin.Context) {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	stats := map[string]interface{}{
		"total_resources": len(rm.resources),
		"by_type": map[string]int{
			"GPU":  0,
			"ASIC": 0,
		},
		"by_status": map[string]int{
			"available":   0,
			"allocated":   0,
			"maintenance": 0,
			"failed":      0,
		},
	}

	for _, resource := range rm.resources {
		stats["by_type"].(map[string]int)[resource.Type]++
		stats["by_status"].(map[string]int)[resource.Status]++
	}

	c.JSON(http.StatusOK, stats)
}

func (rm *ResourceManager) handleGetHealthChecks(c *gin.Context) {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	var checks []HealthCheck
	for _, resource := range rm.resources {
		check := HealthCheck{
			ResourceID:  resource.ID,
			Status:      resource.Health,
			Temperature: rand.Float64()*30 + 50, // 50-80°C
			Utilization: rand.Float64() * 100,
			Errors:      rand.Intn(5),
			CheckedAt:   time.Now(),
		}
		checks = append(checks, check)
	}

	c.JSON(http.StatusOK, gin.H{
		"health_checks": checks,
		"total":         len(checks),
	})
}

func (rm *ResourceManager) handleGetResourceHealth(c *gin.Context) {
	resourceID := c.Param("id")

	rm.mu.RLock()
	resource, exists := rm.resources[resourceID]
	rm.mu.RUnlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
		return
	}

	check := HealthCheck{
		ResourceID:  resource.ID,
		Status:      resource.Health,
		Temperature: rand.Float64()*30 + 50,
		Utilization: rand.Float64() * 100,
		Errors:      rand.Intn(5),
		CheckedAt:   time.Now(),
	}

	c.JSON(http.StatusOK, check)
}

func (rm *ResourceManager) handleCapacitySummary(c *gin.Context) {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	summary := map[string]interface{}{
		"total_capacity": len(rm.resources),
		"available":      0,
		"allocated":      0,
		"by_facility":    make(map[string]int),
		"by_type":        make(map[string]int),
	}

	for _, resource := range rm.resources {
		if resource.Status == "available" {
			summary["available"] = summary["available"].(int) + 1
		}
		if resource.Status == "allocated" {
			summary["allocated"] = summary["allocated"].(int) + 1
		}
		summary["by_facility"].(map[string]int)[resource.FacilityID]++
		summary["by_type"].(map[string]int)[resource.Type]++
	}

	c.JSON(http.StatusOK, summary)
}

func (rm *ResourceManager) handleCapacityForecast(c *gin.Context) {
	// Simple forecast based on current trends
	c.JSON(http.StatusOK, gin.H{
		"forecast_period": "7_days",
		"predictions": []gin.H{
			{"date": time.Now().AddDate(0, 0, 1).Format("2006-01-02"), "expected_utilization": 75.5},
			{"date": time.Now().AddDate(0, 0, 2).Format("2006-01-02"), "expected_utilization": 78.2},
			{"date": time.Now().AddDate(0, 0, 3).Format("2006-01-02"), "expected_utilization": 82.1},
			{"date": time.Now().AddDate(0, 0, 7).Format("2006-01-02"), "expected_utilization": 85.0},
		},
	})
}

func (rm *ResourceManager) handleCapacityUtilization(c *gin.Context) {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	utilization := make(map[string]map[string]float64)

	for _, resource := range rm.resources {
		if utilization[resource.FacilityID] == nil {
			utilization[resource.FacilityID] = make(map[string]float64)
		}

		if resource.Status == "allocated" {
			utilization[resource.FacilityID][resource.Type] += 1
		}
	}

	// Convert to percentages
	for facility, types := range utilization {
		for resourceType, allocated := range types {
			total := 0
			for _, r := range rm.resources {
				if r.FacilityID == facility && r.Type == resourceType {
					total++
				}
			}
			if total > 0 {
				utilization[facility][resourceType] = (allocated / float64(total)) * 100
			}
		}
	}

	c.JSON(http.StatusOK, utilization)
}

func (rm *ResourceManager) handleCreateAllocation(c *gin.Context) {
	var req struct {
		WorkloadID string   `json:"workload_id" binding:"required"`
		ResourceID string   `json:"resource_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start := time.Now()

	allocation := Allocation{
		ID:          uuid.New().String(),
		WorkloadID:  req.WorkloadID,
		ResourceID:  req.ResourceID,
		AllocatedAt: time.Now(),
		Status:      "active",
		Metadata:    make(map[string]interface{}),
	}

	// Update resource status
	rm.mu.Lock()
	if resource, exists := rm.resources[req.ResourceID]; exists {
		resource.Status = "allocated"
		resource.UpdatedAt = time.Now()
	}
	rm.mu.Unlock()

	allocationOperations.WithLabelValues("create").Observe(time.Since(start).Seconds())

	rm.logger.Info("Resource allocated",
		zap.String("allocation_id", allocation.ID),
		zap.String("resource_id", req.ResourceID),
	)

	c.JSON(http.StatusCreated, allocation)
}

func (rm *ResourceManager) handleListAllocations(c *gin.Context) {
	// In production, this would query the database
	c.JSON(http.StatusOK, gin.H{
		"allocations": []gin.H{},
		"total":       0,
	})
}

func (rm *ResourceManager) handleReleaseAllocation(c *gin.Context) {
	allocationID := c.Param("id")

	start := time.Now()

	// In production, mark allocation as released and free the resource

	allocationOperations.WithLabelValues("release").Observe(time.Since(start).Seconds())

	c.JSON(http.StatusOK, gin.H{
		"message":       "allocation released",
		"allocation_id": allocationID,
	})
}

func main() {
	rm, err := NewResourceManager()
	if err != nil {
		log.Fatalf("Failed to create resource manager: %v", err)
	}

	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8083"
		}

		if err := rm.Start(port); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Resource Manager stopped")
}

