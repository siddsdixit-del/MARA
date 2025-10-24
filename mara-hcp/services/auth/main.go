package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

// User represents a system user
type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Never send to client
	Name         string    `json:"name"`
	Role         string    `json:"role"` // admin, customer, operator
	Company      string    `json:"company"`
	Active       bool      `json:"active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// APIKey represents an API key for programmatic access
type APIKey struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Name        string    `json:"name"`
	KeyHash     string    `json:"-"` // Never send to client
	Permissions []string  `json:"permissions"`
	ExpiresAt   time.Time `json:"expires_at"`
	CreatedAt   time.Time `json:"created_at"`
}

// Claims represents JWT claims
type Claims struct {
	UserID  string   `json:"user_id"`
	Email   string   `json:"email"`
	Role    string   `json:"role"`
	Company string   `json:"company"`
	Scopes  []string `json:"scopes"`
	jwt.RegisteredClaims
}

// AuthService handles authentication and authorization
type AuthService struct {
	logger      *zap.Logger
	jwtSecret   []byte
	users       map[string]*User  // In-memory for now, should be database
	apiKeys     map[string]*APIKey
	httpServer  *http.Server
	version     string
}

func NewAuthService() *AuthService {
	logger, _ := zap.NewProduction()

	// Generate JWT secret (in production, load from environment)
	jwtSecret := []byte(getEnv("JWT_SECRET", "dev-secret-key-change-in-production"))

	service := &AuthService{
		logger:    logger,
		jwtSecret: jwtSecret,
		users:     make(map[string]*User),
		apiKeys:   make(map[string]*APIKey),
		version:   "1.0.0",
	}

	// Seed with default users
	service.seedUsers()

	return service
}

func (as *AuthService) seedUsers() {
	// Admin user
	adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	adminUser := &User{
		ID:           uuid.New().String(),
		Email:        "admin@mara.com",
		PasswordHash: string(adminPassword),
		Name:         "Admin User",
		Role:         "admin",
		Company:      "MARA Holdings",
		Active:       true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	as.users[adminUser.Email] = adminUser

	// Customer user
	customerPassword, _ := bcrypt.GenerateFromPassword([]byte("customer123"), bcrypt.DefaultCost)
	customerUser := &User{
		ID:           uuid.New().String(),
		Email:        "john@acme.com",
		PasswordHash: string(customerPassword),
		Name:         "John Doe",
		Role:         "customer",
		Company:      "Acme Corporation",
		Active:       true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	as.users[customerUser.Email] = customerUser

	as.logger.Info("Seeded default users",
		zap.Int("count", len(as.users)),
	)
}

func (as *AuthService) Start(port string) error {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	router.GET("/health", as.handleHealth)
	router.GET("/metrics", as.handleMetrics)

	v1 := router.Group("/api/v1")
	{
		// Public endpoints
		v1.POST("/auth/login", as.handleLogin)
		v1.POST("/auth/register", as.handleRegister)
		v1.POST("/auth/refresh", as.handleRefreshToken)

		// Protected endpoints
		protected := v1.Group("/")
		protected.Use(as.authMiddleware())
		{
			protected.GET("/auth/me", as.handleGetCurrentUser)
			protected.POST("/auth/logout", as.handleLogout)
			protected.PUT("/auth/password", as.handleChangePassword)

			// API Key management
			protected.POST("/api-keys", as.handleCreateAPIKey)
			protected.GET("/api-keys", as.handleListAPIKeys)
			protected.DELETE("/api-keys/:id", as.handleRevokeAPIKey)

			// User management (admin only)
			protected.GET("/users", as.requireRole("admin"), as.handleListUsers)
			protected.POST("/users", as.requireRole("admin"), as.handleCreateUser)
			protected.PUT("/users/:id", as.requireRole("admin"), as.handleUpdateUser)
			protected.DELETE("/users/:id", as.requireRole("admin"), as.handleDeleteUser)
		}
	}

	as.httpServer = &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	as.logger.Info("Starting Auth Service",
		zap.String("port", port),
		zap.String("version", as.version),
	)

	return as.httpServer.ListenAndServe()
}

// Middleware
func (as *AuthService) authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try JWT token first
		authHeader := c.GetHeader("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			claims, err := as.validateJWT(tokenString)
			if err == nil {
				c.Set("user_id", claims.UserID)
				c.Set("email", claims.Email)
				c.Set("role", claims.Role)
				c.Set("company", claims.Company)
				c.Next()
				return
			}
		}

		// Try API Key
		apiKey := c.GetHeader("X-API-Key")
		if apiKey != "" {
			key, err := as.validateAPIKey(apiKey)
			if err == nil {
				c.Set("user_id", key.UserID)
				c.Set("api_key_id", key.ID)
				c.Next()
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
	}
}

func (as *AuthService) requireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "role not found"})
			c.Abort()
			return
		}

		roleStr := userRole.(string)
		for _, role := range roles {
			if roleStr == role {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
		c.Abort()
	}
}

// Handlers
func (as *AuthService) handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "auth",
		"version": as.version,
	})
}

func (as *AuthService) handleMetrics(c *gin.Context) {
	c.String(http.StatusOK, "# Auth service metrics\nauth_users_total %d\nauth_api_keys_total %d\n",
		len(as.users), len(as.apiKeys))
}

func (as *AuthService) handleLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, exists := as.users[req.Email]
	if !exists || !user.Active {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Generate JWT
	token, expiresAt, err := as.generateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	as.logger.Info("User logged in",
		zap.String("email", user.Email),
		zap.String("role", user.Role),
	)

	c.JSON(http.StatusOK, gin.H{
		"token":      token,
		"expires_at": expiresAt,
		"user": gin.H{
			"id":      user.ID,
			"email":   user.Email,
			"name":    user.Name,
			"role":    user.Role,
			"company": user.Company,
		},
	})
}

func (as *AuthService) handleRegister(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8"`
		Name     string `json:"name" binding:"required"`
		Company  string `json:"company" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	if _, exists := as.users[req.Email]; exists {
		c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
		return
	}

	// Hash password
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	// Create user
	user := &User{
		ID:           uuid.New().String(),
		Email:        req.Email,
		PasswordHash: string(passwordHash),
		Name:         req.Name,
		Role:         "customer", // Default role
		Company:      req.Company,
		Active:       true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	as.users[user.Email] = user

	as.logger.Info("User registered",
		zap.String("email", user.Email),
	)

	c.JSON(http.StatusCreated, gin.H{
		"user": gin.H{
			"id":      user.ID,
			"email":   user.Email,
			"name":    user.Name,
			"role":    user.Role,
			"company": user.Company,
		},
	})
}

func (as *AuthService) handleRefreshToken(c *gin.Context) {
	// Implementation for token refresh
	c.JSON(http.StatusOK, gin.H{"message": "refresh token endpoint"})
}

func (as *AuthService) handleGetCurrentUser(c *gin.Context) {
	email, _ := c.Get("email")
	user := as.users[email.(string)]

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":      user.ID,
			"email":   user.Email,
			"name":    user.Name,
			"role":    user.Role,
			"company": user.Company,
		},
	})
}

func (as *AuthService) handleLogout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}

func (as *AuthService) handleChangePassword(c *gin.Context) {
	// Implementation for password change
	c.JSON(http.StatusOK, gin.H{"message": "password changed"})
}

func (as *AuthService) handleCreateAPIKey(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req struct {
		Name        string   `json:"name" binding:"required"`
		Permissions []string `json:"permissions"`
		ExpiresIn   int      `json:"expires_in"` // days
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate random API key
	keyBytes := make([]byte, 32)
	rand.Read(keyBytes)
	apiKeyString := base64.URLEncoding.EncodeToString(keyBytes)

	// Hash the key
	keyHash, _ := bcrypt.GenerateFromPassword([]byte(apiKeyString), bcrypt.DefaultCost)

	expiresAt := time.Now().AddDate(0, 0, req.ExpiresIn)
	if req.ExpiresIn == 0 {
		expiresAt = time.Now().AddDate(1, 0, 0) // 1 year default
	}

	apiKey := &APIKey{
		ID:          uuid.New().String(),
		UserID:      userID.(string),
		Name:        req.Name,
		KeyHash:     string(keyHash),
		Permissions: req.Permissions,
		ExpiresAt:   expiresAt,
		CreatedAt:   time.Now(),
	}

	as.apiKeys[apiKey.ID] = apiKey

	c.JSON(http.StatusCreated, gin.H{
		"api_key":    apiKeyString, // Only shown once!
		"id":         apiKey.ID,
		"name":       apiKey.Name,
		"expires_at": apiKey.ExpiresAt,
	})
}

func (as *AuthService) handleListAPIKeys(c *gin.Context) {
	userID, _ := c.Get("user_id")

	keys := []gin.H{}
	for _, key := range as.apiKeys {
		if key.UserID == userID.(string) {
			keys = append(keys, gin.H{
				"id":         key.ID,
				"name":       key.Name,
				"expires_at": key.ExpiresAt,
				"created_at": key.CreatedAt,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"api_keys": keys})
}

func (as *AuthService) handleRevokeAPIKey(c *gin.Context) {
	keyID := c.Param("id")
	delete(as.apiKeys, keyID)
	c.JSON(http.StatusOK, gin.H{"message": "api key revoked"})
}

func (as *AuthService) handleListUsers(c *gin.Context) {
	users := []gin.H{}
	for _, user := range as.users {
		users = append(users, gin.H{
			"id":      user.ID,
			"email":   user.Email,
			"name":    user.Name,
			"role":    user.Role,
			"company": user.Company,
			"active":  user.Active,
		})
	}
	c.JSON(http.StatusOK, gin.H{"users": users})
}

func (as *AuthService) handleCreateUser(c *gin.Context) {
	// Implementation for admin creating users
	c.JSON(http.StatusOK, gin.H{"message": "user created"})
}

func (as *AuthService) handleUpdateUser(c *gin.Context) {
	// Implementation for admin updating users
	c.JSON(http.StatusOK, gin.H{"message": "user updated"})
}

func (as *AuthService) handleDeleteUser(c *gin.Context) {
	// Implementation for admin deleting users
	c.JSON(http.StatusOK, gin.H{"message": "user deleted"})
}

// Helper functions
func (as *AuthService) generateJWT(user *User) (string, time.Time, error) {
	expiresAt := time.Now().Add(24 * time.Hour) // 24 hour tokens

	claims := &Claims{
		UserID:  user.ID,
		Email:   user.Email,
		Role:    user.Role,
		Company: user.Company,
		Scopes:  []string{"read", "write"},
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "mara-hcp",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(as.jwtSecret)
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expiresAt, nil
}

func (as *AuthService) validateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return as.jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func (as *AuthService) validateAPIKey(keyString string) (*APIKey, error) {
	// In production, hash the incoming key and compare with stored hashes
	for _, key := range as.apiKeys {
		if err := bcrypt.CompareHashAndPassword([]byte(key.KeyHash), []byte(keyString)); err == nil {
			if time.Now().Before(key.ExpiresAt) {
				return key, nil
			}
		}
	}
	return nil, fmt.Errorf("invalid or expired API key")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	service := NewAuthService()

	port := getEnv("PORT", "8085")
	if err := service.Start(port); err != nil && err != http.ErrServerClosed {
		fmt.Printf("Failed to start auth service: %v\n", err)
	}
}

