package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// Pricing rates
const (
	GPUHourlyRate     = 2.50  // USD per GPU-hour
	ASICHourlyRate    = 0.15  // USD per ASIC-hour
	StorageGBRate     = 0.10  // USD per GB-month
	NetworkGBRate     = 0.08  // USD per GB transferred
	APICallRate       = 0.001 // USD per 1000 calls
)

// UsageRecord represents resource usage
type UsageRecord struct {
	ID          string    `json:"id"`
	CustomerID  string    `json:"customer_id"`
	ResourceID  string    `json:"resource_id"`
	ResourceType string   `json:"resource_type"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Duration    float64   `json:"duration_hours"`
	Cost        float64   `json:"cost"`
	Metadata    map[string]interface{} `json:"metadata"`
}

// Invoice represents a customer invoice
type Invoice struct {
	ID           string    `json:"id"`
	CustomerID   string    `json:"customer_id"`
	BillingStart time.Time `json:"billing_start"`
	BillingEnd   time.Time `json:"billing_end"`
	LineItems    []LineItem `json:"line_items"`
	Subtotal     float64   `json:"subtotal"`
	Tax          float64   `json:"tax"`
	Total        float64   `json:"total"`
	Status       string    `json:"status"` // draft, sent, paid, overdue
	DueDate      time.Time `json:"due_date"`
	CreatedAt    time.Time `json:"created_at"`
}

// LineItem represents a line item on an invoice
type LineItem struct {
	Description string  `json:"description"`
	Quantity    float64 `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	Amount      float64 `json:"amount"`
}

// BillingService main service struct
type BillingService struct {
	logger     *zap.Logger
	httpServer *http.Server
	version    string
}

func NewBillingService() *BillingService {
	logger, _ := zap.NewProduction()
	
	return &BillingService{
		logger:  logger,
		version: "1.0.0",
	}
}

func (bs *BillingService) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.GET("/health", bs.handleHealth)
	router.GET("/ready", bs.handleReady)

	v1 := router.Group("/api/v1")
	{
		// Usage tracking
		v1.POST("/usage", bs.handleRecordUsage)
		v1.GET("/usage/:customer_id", bs.handleGetUsage)
		
		// Cost estimation
		v1.POST("/estimate", bs.handleEstimateCost)
		
		// Invoicing
		v1.POST("/invoices/generate", bs.handleGenerateInvoice)
		v1.GET("/invoices/:invoice_id", bs.handleGetInvoice)
		v1.GET("/invoices/customer/:customer_id", bs.handleListInvoices)
		v1.POST("/invoices/:invoice_id/pay", bs.handlePayInvoice)
		
		// Billing summary
		v1.GET("/summary/:customer_id", bs.handleBillingSummary)
		v1.GET("/spending/:customer_id", bs.handleSpendingAnalysis)
	}

	bs.httpServer = &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	bs.logger.Info("Starting Billing Service",
		zap.String("port", port),
		zap.String("version", bs.version),
	)

	return bs.httpServer.ListenAndServe()
}

func (bs *BillingService) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "billing",
		"version": bs.version,
	})
}

func (bs *BillingService) handleReady(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ready"})
}

func (bs *BillingService) handleRecordUsage(c *gin.Context) {
	var usage UsageRecord
	if err := c.ShouldBindJSON(&usage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usage.ID = uuid.New().String()
	
	// Calculate cost based on resource type and duration
	usage.Cost = bs.calculateCost(usage.ResourceType, usage.Duration)

	bs.logger.Info("Usage recorded",
		zap.String("usage_id", usage.ID),
		zap.String("customer_id", usage.CustomerID),
		zap.Float64("cost", usage.Cost),
	)

	c.JSON(http.StatusCreated, usage)
}

func (bs *BillingService) calculateCost(resourceType string, durationHours float64) float64 {
	var rate float64
	switch resourceType {
	case "GPU":
		rate = GPUHourlyRate
	case "ASIC":
		rate = ASICHourlyRate
	default:
		rate = 0
	}
	return rate * durationHours
}

func (bs *BillingService) handleGetUsage(c *gin.Context) {
	customerID := c.Param("customer_id")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	bs.logger.Info("Fetching usage",
		zap.String("customer_id", customerID),
		zap.String("start_date", startDate),
		zap.String("end_date", endDate),
	)

	// Simulated usage records
	usage := []UsageRecord{
		{
			ID:           "usage-001",
			CustomerID:   customerID,
			ResourceID:   "gpu-001",
			ResourceType: "GPU",
			StartTime:    time.Now().Add(-24 * time.Hour),
			EndTime:      time.Now(),
			Duration:     24.0,
			Cost:         60.0, // 24 hours * $2.50
		},
		{
			ID:           "usage-002",
			CustomerID:   customerID,
			ResourceID:   "asic-001",
			ResourceType: "ASIC",
			StartTime:    time.Now().Add(-48 * time.Hour),
			EndTime:      time.Now(),
			Duration:     48.0,
			Cost:         7.20, // 48 hours * $0.15
		},
	}

	totalCost := 0.0
	for _, u := range usage {
		totalCost += u.Cost
	}

	c.JSON(http.StatusOK, gin.H{
		"usage":      usage,
		"total_cost": totalCost,
		"count":      len(usage),
	})
}

func (bs *BillingService) handleEstimateCost(c *gin.Context) {
	var req struct {
		ResourceType string  `json:"resource_type"`
		Quantity     int     `json:"quantity"`
		DurationHours float64 `json:"duration_hours"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	costPerUnit := bs.calculateCost(req.ResourceType, req.DurationHours)
	totalCost := costPerUnit * float64(req.Quantity)

	c.JSON(http.StatusOK, gin.H{
		"resource_type":  req.ResourceType,
		"quantity":       req.Quantity,
		"duration_hours": req.DurationHours,
		"cost_per_unit":  costPerUnit,
		"total_cost":     totalCost,
		"breakdown": gin.H{
			"hourly_rate": bs.getRate(req.ResourceType),
			"unit":        "USD",
		},
	})
}

func (bs *BillingService) getRate(resourceType string) float64 {
	switch resourceType {
	case "GPU":
		return GPUHourlyRate
	case "ASIC":
		return ASICHourlyRate
	default:
		return 0
	}
}

func (bs *BillingService) handleGenerateInvoice(c *gin.Context) {
	var req struct {
		CustomerID   string    `json:"customer_id"`
		BillingStart time.Time `json:"billing_start"`
		BillingEnd   time.Time `json:"billing_end"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate invoice
	invoice := Invoice{
		ID:           uuid.New().String(),
		CustomerID:   req.CustomerID,
		BillingStart: req.BillingStart,
		BillingEnd:   req.BillingEnd,
		LineItems: []LineItem{
			{
				Description: "GPU Usage (H100)",
				Quantity:    240.0, // hours
				UnitPrice:   GPUHourlyRate,
				Amount:      600.0,
			},
			{
				Description: "ASIC Usage (S21)",
				Quantity:    720.0, // hours
				UnitPrice:   ASICHourlyRate,
				Amount:      108.0,
			},
			{
				Description: "Data Transfer",
				Quantity:    100.0, // GB
				UnitPrice:   NetworkGBRate,
				Amount:      8.0,
			},
		},
		Status:    "draft",
		DueDate:   time.Now().AddDate(0, 0, 30),
		CreatedAt: time.Now(),
	}

	// Calculate totals
	for _, item := range invoice.LineItems {
		invoice.Subtotal += item.Amount
	}
	invoice.Tax = invoice.Subtotal * 0.08 // 8% tax
	invoice.Total = invoice.Subtotal + invoice.Tax

	bs.logger.Info("Invoice generated",
		zap.String("invoice_id", invoice.ID),
		zap.String("customer_id", req.CustomerID),
		zap.Float64("total", invoice.Total),
	)

	c.JSON(http.StatusCreated, invoice)
}

func (bs *BillingService) handleGetInvoice(c *gin.Context) {
	invoiceID := c.Param("invoice_id")

	// Simulated invoice
	invoice := Invoice{
		ID:           invoiceID,
		CustomerID:   "cust-001",
		BillingStart: time.Now().AddDate(0, -1, 0),
		BillingEnd:   time.Now(),
		LineItems: []LineItem{
			{Description: "GPU Usage", Quantity: 240, UnitPrice: 2.50, Amount: 600},
		},
		Subtotal:  600.0,
		Tax:       48.0,
		Total:     648.0,
		Status:    "sent",
		DueDate:   time.Now().AddDate(0, 0, 30),
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusOK, invoice)
}

func (bs *BillingService) handleListInvoices(c *gin.Context) {
	customerID := c.Param("customer_id")

	// Simulated invoices
	invoices := []Invoice{
		{
			ID:         "inv-001",
			CustomerID: customerID,
			Total:      648.0,
			Status:     "paid",
			CreatedAt:  time.Now().AddDate(0, -2, 0),
		},
		{
			ID:         "inv-002",
			CustomerID: customerID,
			Total:      725.0,
			Status:     "sent",
			CreatedAt:  time.Now().AddDate(0, -1, 0),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"invoices": invoices,
		"total":    len(invoices),
	})
}

func (bs *BillingService) handlePayInvoice(c *gin.Context) {
	invoiceID := c.Param("invoice_id")

	var req struct {
		PaymentMethod string  `json:"payment_method"`
		Amount        float64 `json:"amount"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simulate payment processing
	bs.logger.Info("Processing payment",
		zap.String("invoice_id", invoiceID),
		zap.Float64("amount", req.Amount),
		zap.String("method", req.PaymentMethod),
	)

	c.JSON(http.StatusOK, gin.H{
		"invoice_id":      invoiceID,
		"payment_status":  "success",
		"transaction_id":  uuid.New().String(),
		"amount_paid":     req.Amount,
		"payment_method":  req.PaymentMethod,
		"processed_at":    time.Now(),
	})
}

func (bs *BillingService) handleBillingSummary(c *gin.Context) {
	customerID := c.Param("customer_id")

	c.JSON(http.StatusOK, gin.H{
		"customer_id":      customerID,
		"current_month": gin.H{
			"gpu_usage_hours":  240.0,
			"gpu_cost":         600.0,
			"asic_usage_hours": 720.0,
			"asic_cost":        108.0,
			"total_cost":       708.0,
		},
		"previous_month": gin.H{
			"total_cost": 648.0,
		},
		"year_to_date": gin.H{
			"total_cost": 7500.0,
		},
		"payment_status": "current",
		"next_invoice_date": time.Now().AddDate(0, 0, 15),
	})
}

func (bs *BillingService) handleSpendingAnalysis(c *gin.Context) {
	customerID := c.Param("customer_id")

	c.JSON(http.StatusOK, gin.H{
		"customer_id": customerID,
		"by_resource_type": gin.H{
			"GPU":  60000.0,
			"ASIC": 10800.0,
		},
		"by_month": []gin.H{
			{"month": "2025-01", "total": 650.0},
			{"month": "2025-02", "total": 680.0},
			{"month": "2025-03", "total": 710.0},
		},
		"top_resources": []gin.H{
			{"resource_id": "gpu-001", "cost": 1500.0},
			{"resource_id": "gpu-002", "cost": 1450.0},
			{"resource_id": "asic-001", "cost": 300.0},
		},
		"trends": gin.H{
			"monthly_growth": 4.5, // percent
			"prediction_next_month": 740.0,
		},
	})
}

func main() {
	service := NewBillingService()

	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8084"
		}

		if err := service.Start(port); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Billing Service stopped")
}

