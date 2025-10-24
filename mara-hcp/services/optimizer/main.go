package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// Prometheus metrics
var (
	profitabilityCalculations = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "optimizer_profitability_calculations_total",
			Help: "Total number of profitability calculations",
		},
		[]string{"resource_type", "workload_type"},
	)

	calculationDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "optimizer_calculation_duration_seconds",
			Help:    "Duration of profitability calculations",
			Buckets: prometheus.ExponentialBuckets(0.0001, 2, 15),
		},
		[]string{"resource_type"},
	)

	currentPrices = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "optimizer_current_prices",
			Help: "Current market prices",
		},
		[]string{"price_type", "unit"},
	)
)

// Price data structures
type PriceData struct {
	Timestamp   time.Time              `json:"timestamp"`
	PriceType   string                 `json:"price_type"`
	Value       float64                `json:"value"`
	Unit        string                 `json:"unit"`
	Source      string                 `json:"source"`
	Region      string                 `json:"region,omitempty"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

type PriceCache struct {
	ElectricityPrice float64
	BTCPrice         float64
	GPUSpotRate      float64
	LastUpdate       time.Time
}

type ProfitabilityScore struct {
	ResourceID       string    `json:"resource_id"`
	WorkloadType     string    `json:"workload_type"`
	Score            float64   `json:"score"`            // 0-100
	ExpectedRevenue  float64   `json:"expected_revenue"` // USD/hour
	EstimatedCost    float64   `json:"estimated_cost"`   // USD/hour
	NetProfit        float64   `json:"net_profit"`       // USD/hour
	Confidence       float64   `json:"confidence"`       // 0-1
	Recommendation   string    `json:"recommendation"`   // allocate, hold, switch
	CalculatedAt     time.Time `json:"calculated_at"`
}

// OptimizerService main service struct
type OptimizerService struct {
	logger       *zap.Logger
	httpServer   *http.Server
	redis        *redis.Client
	priceCache   *PriceCache
	kafkaReader  *kafka.Reader
	version      string
}

// NewOptimizerService creates a new optimizer service
func NewOptimizerService() *OptimizerService {
	logger, _ := zap.NewProduction()

	// Connect to Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST") + ":6379",
		DB:   0,
	})

	// Create Kafka reader for price data
	kafkaReader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{"localhost:9092"},
		Topic:    "price-data",
		GroupID:  "optimizer-price-consumer",
		MinBytes: 10e3,
		MaxBytes: 10e6,
	})

	service := &OptimizerService{
		logger:      logger,
		redis:       redisClient,
		priceCache:  &PriceCache{},
		kafkaReader: kafkaReader,
		version:     "1.0.0",
	}

	// Start price consumer in background
	go service.consumePriceData()

	return service
}

// Start HTTP server
func (s *OptimizerService) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// Health endpoints
	router.GET("/health", s.handleHealth)
	router.GET("/ready", s.handleReady)
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Direct endpoints (for easier testing)
	router.GET("/prices", s.handleGetCurrentPrices)
	router.GET("/profitability", s.handleGetCurrentPrices)  // Temporary alias
	router.POST("/profitability/calculate", s.handleCalculateProfitability)

	// API routes
	v1 := router.Group("/api/v1")
	{
		v1.GET("/prices/current", s.handleGetCurrentPrices)
		v1.GET("/prices", s.handleGetCurrentPrices)  // Alias
		v1.GET("/prices/history", s.handleGetPriceHistory)
		v1.POST("/profitability/calculate", s.handleCalculateProfitability)
		v1.GET("/profitability/:resource_id", s.handleGetResourceProfitability)
		v1.GET("/recommendations", s.handleGetRecommendations)
	}

	s.httpServer = &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	s.logger.Info("Starting Optimizer Service",
		zap.String("port", port),
		zap.String("version", s.version),
	)

	return s.httpServer.ListenAndServe()
}

// Consume price data from Kafka
func (s *OptimizerService) consumePriceData() {
	ctx := context.Background()

	for {
		m, err := s.kafkaReader.ReadMessage(ctx)
		if err != nil {
			s.logger.Error("Failed to read Kafka message", zap.Error(err))
			time.Sleep(time.Second)
			continue
		}

		var priceData PriceData
		if err := json.Unmarshal(m.Value, &priceData); err != nil {
			s.logger.Error("Failed to unmarshal price data", zap.Error(err))
			continue
		}

		// Update price cache
		switch priceData.PriceType {
		case "electricity":
			s.priceCache.ElectricityPrice = priceData.Value
			currentPrices.WithLabelValues("electricity", "USD/kWh").Set(priceData.Value)
		case "btc":
			s.priceCache.BTCPrice = priceData.Value
			currentPrices.WithLabelValues("btc", "USD").Set(priceData.Value)
		case "gpu_spot":
			s.priceCache.GPUSpotRate = priceData.Value
			currentPrices.WithLabelValues("gpu_spot", "USD/hour").Set(priceData.Value)
		}

		s.priceCache.LastUpdate = time.Now()

		s.logger.Info("Updated price cache",
			zap.String("type", priceData.PriceType),
			zap.Float64("value", priceData.Value),
		)

		// Cache in Redis
		key := fmt.Sprintf("price:%s:latest", priceData.PriceType)
		data, _ := json.Marshal(priceData)
		s.redis.Set(ctx, key, data, 5*time.Minute)
	}
}

// Health check
func (s *OptimizerService) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "optimizer",
		"version": s.version,
	})
}

// Readiness check
func (s *OptimizerService) handleReady(c *gin.Context) {
	// Check if we have recent prices
	age := time.Since(s.priceCache.LastUpdate)
	ready := age < 10*time.Minute

	if ready {
		c.JSON(http.StatusOK, gin.H{"status": "ready"})
	} else {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "not ready",
			"reason": "stale price data",
		})
	}
}

// Get current prices
func (s *OptimizerService) handleGetCurrentPrices(c *gin.Context) {
	priceType := c.Query("type")

	if priceType == "" {
		// Return all prices
		c.JSON(http.StatusOK, gin.H{
			"timestamp": s.priceCache.LastUpdate,
			"prices": gin.H{
				"electricity": gin.H{
					"value": s.priceCache.ElectricityPrice,
					"unit":  "USD/kWh",
				},
				"btc": gin.H{
					"value": s.priceCache.BTCPrice,
					"unit":  "USD",
				},
				"gpu_spot": gin.H{
					"value": s.priceCache.GPUSpotRate,
					"unit":  "USD/hour",
				},
			},
		})
		return
	}

	// Return specific price
	var value float64
	var unit string

	switch priceType {
	case "electricity":
		value = s.priceCache.ElectricityPrice
		unit = "USD/kWh"
	case "btc":
		value = s.priceCache.BTCPrice
		unit = "USD"
	case "gpu_spot":
		value = s.priceCache.GPUSpotRate
		unit = "USD/hour"
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid price type"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"timestamp":  s.priceCache.LastUpdate,
		"price_type": priceType,
		"value":      value,
		"unit":       unit,
	})
}

// Get price history (simulated - would query TimescaleDB in production)
func (s *OptimizerService) handleGetPriceHistory(c *gin.Context) {
	priceType := c.Query("type")
	if priceType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type parameter required"})
		return
	}

	// Simulated historical data
	c.JSON(http.StatusOK, gin.H{
		"price_type": priceType,
		"data_points": []gin.H{
			{"timestamp": time.Now().Add(-2 * time.Hour), "value": 65000.0},
			{"timestamp": time.Now().Add(-1 * time.Hour), "value": 65100.0},
			{"timestamp": time.Now(), "value": s.priceCache.BTCPrice},
		},
	})
}

// Calculate profitability
func (s *OptimizerService) handleCalculateProfitability(c *gin.Context) {
	var req struct {
		ResourceType string  `json:"resource_type" binding:"required"`
		WorkloadType string  `json:"workload_type" binding:"required"`
		PowerDrawW   float64 `json:"power_draw_w"`
		HashRateTHS  float64 `json:"hash_rate_ths,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start := time.Now()

	var score *ProfitabilityScore

	switch req.ResourceType {
	case "GPU":
		score = s.calculateGPUProfitability(req.WorkloadType, req.PowerDrawW)
	case "ASIC":
		score = s.calculateASICProfitability(req.HashRateTHS, req.PowerDrawW)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid resource type"})
		return
	}

	profitabilityCalculations.WithLabelValues(req.ResourceType, req.WorkloadType).Inc()
	calculationDuration.WithLabelValues(req.ResourceType).Observe(time.Since(start).Seconds())

	c.JSON(http.StatusOK, score)
}

// Calculate GPU profitability
func (s *OptimizerService) calculateGPUProfitability(workloadType string, powerDrawW float64) *ProfitabilityScore {
	// Get current prices
	electricityPrice := s.priceCache.ElectricityPrice
	gpuSpotRate := s.priceCache.GPUSpotRate

	// Use default power if not provided
	if powerDrawW == 0 {
		powerDrawW = 700 // H100 typical power
	}

	var expectedRevenue, estimatedCost float64

	switch workloadType {
	case "ai_inference_realtime", "ai_inference_batch", "model_training":
		// Revenue from AI workload
		expectedRevenue = gpuSpotRate

		// Cost = electricity
		powerDrawKW := powerDrawW / 1000
		estimatedCost = powerDrawKW * electricityPrice

	default:
		expectedRevenue = 0
		estimatedCost = 0
	}

	netProfit := expectedRevenue - estimatedCost

	// Calculate score (0-100)
	var scoreValue float64
	if expectedRevenue > 0 {
		scoreValue = (netProfit / expectedRevenue) * 100
	}

	// Determine recommendation
	var recommendation string
	if scoreValue > 70 {
		recommendation = "allocate"
	} else if scoreValue > 30 {
		recommendation = "hold"
	} else {
		recommendation = "switch"
	}

	return &ProfitabilityScore{
		ResourceID:      "gpu-simulated",
		WorkloadType:    workloadType,
		Score:           math.Max(0, scoreValue),
		ExpectedRevenue: expectedRevenue,
		EstimatedCost:   estimatedCost,
		NetProfit:       netProfit,
		Confidence:      0.85,
		Recommendation:  recommendation,
		CalculatedAt:    time.Now(),
	}
}

// Calculate ASIC profitability
func (s *OptimizerService) calculateASICProfitability(hashRateTHS, powerDrawW float64) *ProfitabilityScore {
	// Get current prices
	electricityPrice := s.priceCache.ElectricityPrice
	btcPrice := s.priceCache.BTCPrice

	// Use defaults if not provided
	if hashRateTHS == 0 {
		hashRateTHS = 270 // S21 hash rate
	}
	if powerDrawW == 0 {
		powerDrawW = 3645 // S21 power
	}

	// Bitcoin mining profitability
	networkDifficulty := 70e12          // Current approximate difficulty
	_ = 3.125                           // BTC per block (post-2024 halving) - for future use
	secondsPerDay := 86400.0

	// Expected BTC mined per day (simplified formula)
	btcPerDay := (hashRateTHS * 1e12 * secondsPerDay) / (networkDifficulty * math.Pow(2, 32))
	btcPerHour := btcPerDay / 24

	expectedRevenue := btcPerHour * btcPrice

	// Power cost
	powerDrawKW := powerDrawW / 1000
	estimatedCost := powerDrawKW * electricityPrice

	netProfit := expectedRevenue - estimatedCost

	// Calculate score
	var scoreValue float64
	if expectedRevenue > 0 {
		scoreValue = (netProfit / expectedRevenue) * 100
	}

	// Recommendation
	var recommendation string
	if netProfit > 0 {
		recommendation = "allocate"
	} else {
		recommendation = "switch"
	}

	return &ProfitabilityScore{
		ResourceID:      "asic-simulated",
		WorkloadType:    "bitcoin_mining",
		Score:           scoreValue,
		ExpectedRevenue: expectedRevenue,
		EstimatedCost:   estimatedCost,
		NetProfit:       netProfit,
		Confidence:      0.90,
		Recommendation:  recommendation,
		CalculatedAt:    time.Now(),
	}
}

// Get resource profitability
func (s *OptimizerService) handleGetResourceProfitability(c *gin.Context) {
	resourceID := c.Param("resource_id")

	// Simulated response
	c.JSON(http.StatusOK, gin.H{
		"resource_id": resourceID,
		"scores": []gin.H{
			{
				"workload_type":    "ai_inference_realtime",
				"score":            85.5,
				"expected_revenue": 2.50,
				"estimated_cost":   0.028,
				"net_profit":       2.472,
				"recommendation":   "allocate",
			},
			{
				"workload_type":    "bitcoin_mining",
				"score":            -15.3,
				"expected_revenue": 0.85,
				"estimated_cost":   1.00,
				"net_profit":       -0.15,
				"recommendation":   "switch",
			},
		},
	})
}

// Get recommendations
func (s *OptimizerService) handleGetRecommendations(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"timestamp": time.Now(),
		"recommendations": []gin.H{
			{
				"action":  "Allocate GPUs to AI inference",
				"reason":  "High profitability (85% margin)",
				"impact":  "Expected $12,360/hour additional revenue",
				"urgency": "high",
			},
			{
				"action":  "Switch 25% of ASICs to standby",
				"reason":  "Negative profitability during peak electricity prices",
				"impact":  "Save $4,500/hour in electricity costs",
				"urgency": "medium",
			},
		},
		"market_conditions": gin.H{
			"btc_price":         s.priceCache.BTCPrice,
			"electricity_price": s.priceCache.ElectricityPrice,
			"gpu_spot_rate":     s.priceCache.GPUSpotRate,
		},
	})
}

func main() {
	service := NewOptimizerService()

	// Start server
	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8081"
		}

		if err := service.Start(port); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Optimizer Service stopped")
}

