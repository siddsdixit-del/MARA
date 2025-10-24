# MARA HCP - Frontend API Integration Guide

This guide explains how to integrate the React frontend with the backend microservices.

---

## 🔗 API Services Created

### **1. API Service Layer** (`src/services/api.js`)

Centralized service for all backend communication:

```javascript
import apiService from './services/api';

// Submit workload
const result = await apiService.submitWorkload({
  customer_id: 'cust-001',
  workload_type: 'ai_inference_realtime',
  priority: 1,
  requirements: { gpu_type: 'H100', gpu_count: 1 }
});

// Get current prices
const prices = await apiService.getCurrentPrices();

// Get queue status
const queue = await apiService.getQueueDepth();
```

### **2. React Hooks** (`src/hooks/useBackendAPI.js`)

Easy-to-use React hooks with loading states:

```javascript
import { useWorkloads, usePrices, useQueueStatus } from './hooks/useBackendAPI';

function MyComponent() {
  const { data: workloads, loading, error } = useWorkloads();
  const { data: prices } = usePrices();
  const { data: queueStatus } = useQueueStatus();

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return <div>{/* Render data */}</div>;
}
```

---

## 🚀 Quick Integration Steps

### **Step 1: Start Backend Services**

```bash
cd /Users/sdixit/Documents/MARA/mara-hcp

# Start infrastructure
make start

# Start application services (in separate terminals or use script)
./scripts/start-all-services.sh

# Or manually:
cd services/orchestrator && go run main.go      # Port 8080
cd services/optimizer && go run main.go         # Port 8081
cd services/workload-router && go run main.go   # Port 8082
```

### **Step 2: Verify Backend is Running**

```bash
# Check all services
curl http://localhost:8080/health  # Orchestrator
curl http://localhost:8081/health  # Optimizer
curl http://localhost:8082/health  # Router

# Or use test script
cd /Users/sdixit/Documents/MARA/mara-hcp
./scripts/test-system.sh
```

### **Step 3: Update Frontend Pages**

Replace synthetic data with live API calls in your pages.

#### **Example: Dashboard.jsx**

```javascript
// OLD: Using synthetic data
import { adminData } from '../data/adminData';
const kpis = adminData.kpis;

// NEW: Using live API
import { useBackendData } from '../hooks/useBackendAPI';
import apiService from '../services/api';

function Dashboard() {
  const { data: status, loading } = useBackendData(() => 
    apiService.getOrchestratorStatus()
  );

  const { data: prices } = usePrices();
  const { data: queue } = useQueueStatus();

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <KPICard
          title="Active Workloads"
          value={status?.active_workloads || 0}
          icon={<WorkIcon />}
        />
      </Grid>
      {/* ... more KPIs */}
    </Grid>
  );
}
```

#### **Example: Workloads.jsx**

```javascript
import { useWorkloads, useWorkloadSubmit } from '../hooks/useBackendAPI';

function Workloads() {
  const { data: workloadsData, loading, refetch } = useWorkloads();
  const { submitWorkload, submitting } = useWorkloadSubmit();

  const handleSubmit = async (formData) => {
    try {
      await submitWorkload(formData);
      refetch(); // Refresh list
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <DataGrid
      rows={workloadsData?.workloads || []}
      columns={columns}
      pageSize={25}
    />
  );
}
```

---

## 📡 API Endpoints Reference

### **Orchestrator (Port 8080)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/workloads` | Submit workload |
| GET | `/api/v1/workloads/:id` | Get workload details |
| GET | `/api/v1/workloads` | List workloads |
| POST | `/api/v1/allocate` | Allocate resources |
| POST | `/api/v1/release` | Release resources |
| GET | `/api/v1/status` | Service status |

### **Optimizer (Port 8081)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/prices/current` | Current prices |
| GET | `/api/v1/prices/history` | Price history |
| POST | `/api/v1/profitability/calculate` | Calculate profitability |
| GET | `/api/v1/profitability/:id` | Resource profitability |
| GET | `/api/v1/recommendations` | Economic recommendations |

### **Workload Router (Port 8082)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/route` | Route workload |
| GET | `/api/v1/queue/depth` | Queue depth |
| GET | `/api/v1/queue/status` | Queue status |
| POST | `/api/v1/workload/classify` | Classify workload |

---

## 🔄 Data Flow Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 3001)    │
└────────┬────────┘
         │
         ├─────────────┐
         │             │
         ▼             ▼
┌──────────────┐ ┌──────────────┐
│ Orchestrator │ │  Optimizer   │
│ Port 8080    │ │  Port 8081   │
└──────┬───────┘ └──────┬───────┘
       │                │
       ▼                ▼
┌──────────────────────────────┐
│  Workload Router (8082)      │
│  Queue Management            │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Simulators                  │
│  - GPU (10 units)            │
│  - ASIC (50 units)           │
│  - Market Data               │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Kafka → TimescaleDB         │
│  Metrics Storage             │
└──────────────────────────────┘
```

---

## 🧪 Testing Integration

### **Test 1: Submit Workload from Frontend**

1. Open frontend: http://localhost:3001
2. Navigate to "Workloads" page
3. Click "Submit New Workload"
4. Fill form and submit
5. Check terminal logs for backend service receiving request

### **Test 2: Real-Time Price Updates**

1. Open frontend Dashboard
2. Watch the price KPIs
3. Backend simulators update prices every 10s-5min
4. Frontend should reflect changes (with polling or WebSocket)

### **Test 3: Queue Status**

1. Submit multiple workloads
2. Navigate to Queue Status (if implemented)
3. Should show real queue depth from backend

---

## 🔧 Configuration

### **API Base URLs**

Located in `src/services/api.js`:

```javascript
const API_BASE_URLS = {
  orchestrator: 'http://localhost:8080/api/v1',
  optimizer: 'http://localhost:8081/api/v1',
  router: 'http://localhost:8082/api/v1',
};
```

**For Production**: Update to use environment variables:

```javascript
const API_BASE_URLS = {
  orchestrator: process.env.REACT_APP_ORCHESTRATOR_URL || 'http://localhost:8080/api/v1',
  optimizer: process.env.REACT_APP_OPTIMIZER_URL || 'http://localhost:8081/api/v1',
  router: process.env.REACT_APP_ROUTER_URL || 'http://localhost:8082/api/v1',
};
```

---

## 🛡️ Error Handling

The API service includes automatic fallback to mock data:

```javascript
// If backend is down, automatically uses synthetic data
const { data: workloads } = useWorkloads();
// Returns real data if available, otherwise returns adminData.workloads
```

To disable fallback (throw errors instead):

```javascript
// In api.js, use direct methods instead of *WithFallback versions
const workloads = await apiService.listWorkloads();
```

---

## 🔄 Real-Time Updates (Future Enhancement)

Add WebSocket support for live updates:

```javascript
// src/services/websocket.js
const ws = new WebSocket('ws://localhost:8080/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update React state with real-time data
};
```

---

## 📊 Monitoring Integration

View backend metrics in frontend:

```javascript
// Fetch Prometheus metrics
const response = await fetch('http://localhost:8080/metrics');
const metrics = await response.text();

// Parse and display in dashboard
```

---

## ✅ Integration Checklist

- [x] API service layer created (`src/services/api.js`)
- [x] React hooks created (`src/hooks/useBackendAPI.js`)
- [x] Backend services runnable (Orchestrator, Optimizer, Router)
- [x] Fallback to mock data when backend unavailable
- [ ] Update Dashboard.jsx to use live APIs
- [ ] Update Workloads.jsx to use live APIs
- [ ] Update Billing.jsx to use live APIs
- [ ] Add WebSocket for real-time updates
- [ ] Add error notifications (Snackbar)
- [ ] Add loading states to all pages
- [ ] Test end-to-end flow

---

## 🎯 Next Steps

1. **Start Backend**: `./scripts/start-all-services.sh`
2. **Test APIs**: `./scripts/test-system.sh`
3. **Update Pages**: Replace synthetic data imports with hooks
4. **Add Real-Time**: Implement WebSocket connections
5. **Polish UX**: Add loading spinners and error handling

---

**Questions or Issues?**
- Check backend logs in service terminals
- Use `./scripts/test-system.sh` to verify all services
- Review API responses in browser DevTools Network tab

Happy integrating! 🚀

