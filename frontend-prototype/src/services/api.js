/**
 * MARA HCP API Service
 * Connects frontend to backend microservices
 */

const API_BASE_URLS = {
  orchestrator: 'http://localhost:8080/api/v1',
  optimizer: 'http://localhost:8081/api/v1',
  router: 'http://localhost:8082/api/v1',
  resourceManager: 'http://localhost:8083/api/v1',
  billing: 'http://localhost:8084/api/v1',
  auth: 'http://localhost:8085/api/v1',
  websocket: 'ws://localhost:8086/ws',
};

class APIService {
  constructor() {
    this.authToken = localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token
   */
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    if (this.authToken) {
      return { 'Authorization': `Bearer ${this.authToken}` };
    }
    return {};
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async fetchAPI(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ============================================
  // AUTHENTICATION APIs (Port 8085)
  // ============================================

  /**
   * Login user
   */
  async login(email, password) {
    const response = await this.fetchAPI(`${API_BASE_URLS.auth}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  /**
   * Register new user
   */
  async register(userData) {
    return this.fetchAPI(`${API_BASE_URLS.auth}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    return this.fetchAPI(`${API_BASE_URLS.auth}/auth/me`);
  }

  /**
   * Logout
   */
  async logout() {
    await this.fetchAPI(`${API_BASE_URLS.auth}/auth/logout`, {
      method: 'POST',
    });
    this.setAuthToken(null);
  }

  // ============================================
  // ORCHESTRATOR APIs (Port 8080)
  // ============================================

  /**
   * Submit a new workload
   */
  async submitWorkload(workloadData) {
    return this.fetchAPI(`${API_BASE_URLS.orchestrator}/workloads`, {
      method: 'POST',
      body: JSON.stringify(workloadData),
    });
  }

  /**
   * Get workload details
   */
  async getWorkload(workloadId) {
    return this.fetchAPI(`${API_BASE_URLS.orchestrator}/workloads/${workloadId}`);
  }

  /**
   * List workloads (optionally filtered)
   */
  async listWorkloads(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.fetchAPI(`${API_BASE_URLS.orchestrator}/workloads?${query}`);
  }

  /**
   * Get service status
   */
  async getOrchestratorStatus() {
    return this.fetchAPI(`${API_BASE_URLS.orchestrator}/status`);
  }

  /**
   * Allocate resources
   */
  async allocateResources(allocationData) {
    return this.fetchAPI(`${API_BASE_URLS.orchestrator}/allocate`, {
      method: 'POST',
      body: JSON.stringify(allocationData),
    });
  }

  /**
   * Release resources
   */
  async releaseResources(allocationId) {
    return this.fetchAPI(`${API_BASE_URLS.orchestrator}/release?allocation_id=${allocationId}`, {
      method: 'POST',
    });
  }

  // ============================================
  // OPTIMIZER APIs (Port 8081)
  // ============================================

  /**
   * Get current market prices
   */
  async getCurrentPrices(priceType = '') {
    const query = priceType ? `?type=${priceType}` : '';
    return this.fetchAPI(`${API_BASE_URLS.optimizer}/prices/current${query}`);
  }

  /**
   * Get price history
   */
  async getPriceHistory(priceType) {
    return this.fetchAPI(`${API_BASE_URLS.optimizer}/prices/history?type=${priceType}`);
  }

  /**
   * Calculate profitability
   */
  async calculateProfitability(data) {
    return this.fetchAPI(`${API_BASE_URLS.optimizer}/profitability/calculate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get resource profitability
   */
  async getResourceProfitability(resourceId) {
    return this.fetchAPI(`${API_BASE_URLS.optimizer}/profitability/${resourceId}`);
  }

  /**
   * Get economic recommendations
   */
  async getRecommendations() {
    return this.fetchAPI(`${API_BASE_URLS.optimizer}/recommendations`);
  }

  // ============================================
  // WORKLOAD ROUTER APIs (Port 8082)
  // ============================================

  /**
   * Route a workload
   */
  async routeWorkload(workloadData) {
    return this.fetchAPI(`${API_BASE_URLS.router}/route`, {
      method: 'POST',
      body: JSON.stringify(workloadData),
    });
  }

  /**
   * Get queue depth
   */
  async getQueueDepth() {
    return this.fetchAPI(`${API_BASE_URLS.router}/queue/depth`);
  }

  /**
   * Get queue status
   */
  async getQueueStatus() {
    return this.fetchAPI(`${API_BASE_URLS.router}/queue/status`);
  }

  /**
   * Classify workload
   */
  async classifyWorkload(data) {
    return this.fetchAPI(`${API_BASE_URLS.router}/workload/classify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // RESOURCE MANAGER APIs (Port 8083)
  // ============================================

  /**
   * List all resources
   */
  async listResources(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.fetchAPI(`${API_BASE_URLS.resourceManager}/resources?${query}`);
  }

  /**
   * Get resource by ID
   */
  async getResource(resourceId) {
    return this.fetchAPI(`${API_BASE_URLS.resourceManager}/resources/${resourceId}`);
  }

  /**
   * Trigger resource discovery
   */
  async discoverResources() {
    return this.fetchAPI(`${API_BASE_URLS.resourceManager}/discovery/scan`, {
      method: 'POST',
    });
  }

  /**
   * Get health checks
   */
  async getHealthChecks() {
    return this.fetchAPI(`${API_BASE_URLS.resourceManager}/health-checks`);
  }

  /**
   * Get capacity summary
   */
  async getCapacitySummary() {
    return this.fetchAPI(`${API_BASE_URLS.resourceManager}/capacity/summary`);
  }

  // ============================================
  // BILLING APIs (Port 8084)
  // ============================================

  /**
   * Get usage summary
   */
  async getUsageSummary(customerId = null) {
    const query = customerId ? `?customer_id=${customerId}` : '';
    return this.fetchAPI(`${API_BASE_URLS.billing}/usage/summary${query}`);
  }

  /**
   * List invoices
   */
  async listInvoices(customerId = null) {
    const query = customerId ? `?customer_id=${customerId}` : '';
    return this.fetchAPI(`${API_BASE_URLS.billing}/invoices${query}`);
  }

  /**
   * Generate invoice
   */
  async generateInvoice(data) {
    return this.fetchAPI(`${API_BASE_URLS.billing}/invoices/generate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get cost estimate
   */
  async getCostEstimate(data) {
    return this.fetchAPI(`${API_BASE_URLS.billing}/usage/estimate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // HEALTH CHECK APIs
  // ============================================

  /**
   * Check health of all services
   */
  async checkAllServices() {
    const services = [
      { name: 'Orchestrator', url: 'http://localhost:8080/health' },
      { name: 'Optimizer', url: 'http://localhost:8081/health' },
      { name: 'Router', url: 'http://localhost:8082/health' },
      { name: 'Resource Manager', url: 'http://localhost:8083/health' },
      { name: 'Billing', url: 'http://localhost:8084/health' },
      { name: 'Auth', url: 'http://localhost:8085/health' },
      { name: 'WebSocket', url: 'http://localhost:8086/health' },
    ];

    const results = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await fetch(service.url);
          const data = await response.json();
          return {
            name: service.name,
            status: data.status === 'healthy' ? 'online' : 'degraded',
            ...data,
          };
        } catch (error) {
          return {
            name: service.name,
            status: 'offline',
            error: error.message,
          };
        }
      })
    );

    return results.map((result, index) => ({
      ...services[index],
      ...result.value,
    }));
  }

  // ============================================
  // MOCK DATA FALLBACK
  // (Returns mock data if backend is unavailable)
  // ============================================

  /**
   * Get workloads with fallback to mock data
   */
  async getWorkloadsWithFallback(params = {}) {
    try {
      return await this.listWorkloads(params);
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      // Return existing synthetic data
      const { adminData } = await import('../data/adminData');
      return { workloads: adminData.workloads, total: adminData.workloads.length };
    }
  }

  /**
   * Get prices with fallback
   */
  async getPricesWithFallback() {
    try {
      return await this.getCurrentPrices();
    } catch (error) {
      console.warn('Backend unavailable, using mock prices');
      return {
        timestamp: new Date().toISOString(),
        prices: {
          electricity: { value: 0.045, unit: 'USD/kWh' },
          btc: { value: 65234.5, unit: 'USD' },
          gpu_spot: { value: 2.73, unit: 'USD/hour' },
        },
      };
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export for convenience
export default apiService;

