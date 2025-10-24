# 📊 Synthetic Data Guide - MARA HCP Prototype

## Overview

The prototype now includes comprehensive, realistic synthetic data that demonstrates all use cases from the development plan. Data is **role-scoped** with distinct datasets for Admin (platform-wide) and Customer (single-tenant) views.

---

## 🗂️ Data Files

### `/src/data/adminData.js` - Platform-Wide Data

**Contains:**
- ✅ **8 Customers**: Acme Corporation, TechCo Inc, DataCorp LLC, AI Research Labs, CloudML Systems, Neural Networks Co, DeepTech Solutions, Quantum AI
- ✅ **3 Facilities**: Texas-1 (Dallas), Texas-2 (Austin), Canada-1 (Quebec)
- ✅ **30+ Workloads**: Across ALL customers (AI Inference RT, Model Training, Hyperparameter Tuning, Data Processing, Batch Inference)
- ✅ **16+ GPU/ASIC Resources**: H100 80GB, L40S 48GB, A100 80GB, Antminer S19 XP, Whatsminer M50S
- ✅ **12 Platform Alerts**: Critical (GPU overheating, power surges, ASIC failures), Warnings (budget alerts, network latency), Info (maintenance, onboarding)
- ✅ **Platform-Wide KPIs**: $196K revenue, 142 workloads, 10,248 GPUs, 94.2% utilization
- ✅ **Revenue Breakdown**: By customer, by day, BTC mining vs AI inference
- ✅ **Economic Metrics**: BTC price, electricity rates, GPU spot rates, profitability calculations

### `/src/data/customerData.js` - Single Tenant Data (Acme Corporation)

**Contains:**
- ✅ **Customer Profile**: Enterprise tier, Financial Services industry, $25K monthly budget
- ✅ **10 Workloads**: 8 active/queued (fraud detection, credit risk, churn prediction), 2 completed
- ✅ **Detailed Workload Metadata**: Model names, input/output paths, throughput, latency, training progress, GPU utilization
- ✅ **6 Customer Alerts**: Budget warnings, queue notifications, completion alerts
- ✅ **Billing Data**: $18,750 spent (75% of budget), breakdown by workload type, top 5 models, invoice history
- ✅ **API Keys**: 4 keys (Production, Development, Testing, Legacy/Revoked)
- ✅ **Team Members**: 4 users with different roles (Admin, Engineers, Viewer)
- ✅ **Savings Comparison**: vs AWS/Azure/GCP ($12.6K saved, 40.2% cheaper)

---

## 🎭 Role-Based Data Differences

| Data Type | Admin View | Customer View |
|-----------|-----------|---------------|
| **Workloads** | All 30+ from all customers | Only Acme Corp's 10 workloads |
| **Customers** | See all 8 customers | Only see own (Acme Corp) |
| **Facilities** | All 3 facilities with location details | Facilities abstracted away |
| **Resources** | Browse all 10K+ GPUs/ASICs | Can't browse, just see allocation |
| **Billing** | Platform-wide $196K revenue | Personal $18.7K spending |
| **Alerts** | 12 system alerts (infrastructure) | 6 personal alerts (workloads, budget) |
| **Revenue** | See all customer billing | See only own spending |

---

## 📋 Use Cases Covered

### 1. **Economic Optimization Engine**
- ✅ Real-time BTC price tracking ($72,450)
- ✅ Electricity rates ($/kWh)
- ✅ GPU spot rates (H100: $2.50/hr, L40S: $1.20/hr)
- ✅ Profitability calculations (42.5% margin)
- ✅ Revenue split: BTC mining ($45.6K) vs AI inference ($151.1K)

### 2. **Workload Router**
- ✅ Multi-priority workloads: Critical, High, Medium, Low
- ✅ Multiple workload types: AI Inference RT, Model Training, Batch Processing, Hyperparameter Tuning, Data Processing
- ✅ Queue management (3 queued workloads with wait times)
- ✅ Resource allocation (8x H100, 16x H100, 64x H100 configurations)

### 3. **Resource Manager**
- ✅ GPU inventory: H100 80GB (Texas-1, Texas-2), L40S 48GB (Canada-1), A100 80GB
- ✅ ASIC inventory: Antminer S19 XP, Whatsminer M50S
- ✅ Resource status: Active, Idle, Maintenance, Failed
- ✅ Real-time metrics: Utilization %, temperature (°C), power (W)
- ✅ Workload assignments (which customer/workload is using which GPU)

### 4. **Customer Portal**
- ✅ Workload submission (big CTA button)
- ✅ Budget tracking with visual progress bar (75% used)
- ✅ Detailed workload metadata (model names, training progress, throughput)
- ✅ API key management (4 keys with permissions)
- ✅ Team management (4 members with roles)
- ✅ Invoice history (3 paid invoices)

### 5. **Monitoring & Observability**
- ✅ Real-time utilization charts (by facility, by customer)
- ✅ Power consumption tracking (MW per facility)
- ✅ GPU temperature monitoring (°C per device)
- ✅ Workload performance metrics (throughput, latency, GPU util)

### 6. **Billing System**
- ✅ Multi-tenant billing (8 customers with individual budgets)
- ✅ Usage tracking by workload type (pie chart breakdown)
- ✅ Daily spending trends (line charts)
- ✅ Top models by cost
- ✅ Budget alerts (97% used → warning)
- ✅ Invoice generation (monthly invoices with payment status)

### 7. **Alert Management**
- ✅ Severity levels: Critical, Warning, Info, Success
- ✅ Alert categories: Infrastructure (temperature, power), Customer (budget, queue), System (maintenance, onboarding)
- ✅ Acknowledgement status
- ✅ Actionable alerts with CTAs
- ✅ Facility/customer tagging

### 8. **Hybrid Workload Switching**
- ✅ BTC mining workloads on ASICs
- ✅ AI inference on GPUs
- ✅ Economic data showing when to switch (switching opportunities: 3 times today)
- ✅ Revenue comparison by workload type

---

## 🔍 Realistic Data Patterns

### Workload Distribution
- **AI Research Labs**: Largest customer (64x H100 training jobs, $58K/month)
- **TechCo Inc**: High utilization (32x H100 jobs, $42K/month)
- **Acme Corporation**: Mid-tier (mostly inference, $18.7K/month)
- **Neural Networks Co**: Startup tier (L40S GPUs, $6.2K/month)

### Resource Utilization
- **Texas-1**: 96% utilization (highest demand)
- **Texas-2**: 94% utilization
- **Canada-1**: 89% utilization (some idle capacity)
- **Failed/Maintenance**: Realistic 1-2% of resources offline

### Billing Patterns
- **High utilization customers**: 90-97% of budget (at risk)
- **On-track customers**: 65-85% of budget
- **Growth trends**: +8% to +15% month-over-month

### Alert Distribution
- **Critical**: 3 unacknowledged (GPU overheat, power surge, ASIC failure)
- **Warning**: 4 alerts (budget warnings, network latency)
- **Info**: 5 alerts (maintenance, onboarding, price alerts)

---

## 💡 Key Features Demonstrated

### 1. Multi-Tenancy
- 8 different customers with isolated data
- Customer data never leaks between tenants
- Admin can see all, customer sees only own

### 2. Detailed Workload Metadata
Each workload includes:
- Name (e.g., "Real-Time Fraud Detection Model")
- Type (AI Inference RT, Model Training, etc.)
- Status (Running, Queued, Completed, Failed)
- Resources (8x H100, 16x H100, etc.)
- Facility (Texas-1, Texas-2, Canada-1)
- Priority (Critical, High, Medium, Low)
- Runtime (2h 34m, 12h 45m, etc.)
- Cost ($342.50, $2,856.00, etc.)
- GPU Utilization (94%, 98%, etc.)
- Throughput (1,245 inferences/sec, 4,820 samples/sec)
- Latency (12ms p95, 8ms p95)
- Model name (fraud-detector-v3.2, credit-risk-v2)
- Progress (156/200 epochs, 75% complete)

### 3. Real-Time Metrics
- GPU utilization by facility (line charts)
- Daily spending (bar charts)
- Budget progress (progress bars)
- Resource temperature/power (gauges)

### 4. Economic Intelligence
- BTC price: $72,450
- Electricity: $0.048/kWh
- GPU spot rates: $2.50/hr (H100)
- Profit margin: 42.5%
- Switching opportunities: 3 today

---

## 🎯 Testing Scenarios

### Admin Flow:
1. **Dashboard**: See $196K total revenue, 142 workloads across 8 customers
2. **Workloads**: Filter by customer, see ALL 30+ workloads
3. **Resources**: Browse 16+ GPUs/ASICs across 3 facilities
4. **Billing**: See revenue breakdown by customer (8 customers)
5. **Alerts**: Manage 12 system alerts (critical infrastructure issues)

### Customer Flow:
1. **Dashboard**: See $18.7K personal spending, 8 workloads, 75% budget used
2. **My Workloads**: See ONLY Acme Corp's 10 workloads with detailed metadata
3. **Billing**: Daily spending trends, top 5 models, invoice history
4. **Alerts**: 6 personal alerts (budget warning, queue notification, completion)
5. **Help**: FAQs, documentation, submit support ticket

---

## 📝 Data Validation

### Admin View Validations:
- ✅ Total revenue ($196K) = sum of all customer spending
- ✅ Total workloads (142) includes all customers
- ✅ Each workload has a `customer` and `customerId` field
- ✅ Facilities show correct GPU counts (4096 + 4096 + 2056 = 10,248)
- ✅ Alerts reference specific facilities/customers

### Customer View Validations:
- ✅ Workloads ONLY belong to Acme Corporation
- ✅ No `customer` field needed (implicit)
- ✅ Billing total ($18.7K) matches budget usage (75%)
- ✅ Workload count (10) matches dashboard KPI
- ✅ Alerts are personal (no system infrastructure alerts)

---

## 🚀 How to Use

### 1. Switch Roles to See Different Data:
```javascript
// In browser
// Toggle the role switcher in top-right corner
// Or change role on login page
```

### 2. All Pages Use Role-Based Data:
- `Dashboard.jsx` → uses `platformKPIs` (admin) or `customerKPIs` (customer)
- `Workloads.jsx` → uses `allWorkloads` (admin) or `customerWorkloads` (customer)
- `Billing.jsx` → uses `platformBilling` (admin) or `customerBilling` (customer)
- `Alerts.jsx` → uses `platformAlerts` (admin) or `customerAlerts` (customer)
- `Resources.jsx` → uses `allResources` (admin only)

### 3. Data is Fully Typed and Documented:
```javascript
// Example workload structure
{
  id: 'wl-abc123',
  name: 'Real-Time Fraud Detection Model',
  type: 'AI Inference RT',
  status: 'Running',
  priority: 'High',
  resources: '8x H100',
  facility: 'Texas-1',
  cost: 342.50,
  gpuUtilization: 94,
  throughput: '1,245 inferences/sec',
  latency: '12ms p95',
  model: 'fraud-detector-v3.2',
}
```

---

## 📊 Data Statistics

| Metric | Count/Value |
|--------|-------------|
| **Total Customers** | 8 |
| **Total Workloads** | 30+ |
| **Acme Workloads** | 10 |
| **Total GPUs** | 10,248 |
| **Resource Entries** | 20+ |
| **Platform Alerts** | 12 |
| **Customer Alerts** | 6 |
| **Facilities** | 3 |
| **Revenue (MTD)** | $196,750 |
| **Acme Spending (MTD)** | $18,750 |
| **BTC Price** | $72,450 |
| **Platform Utilization** | 94.2% |

---

## 🎨 Visualization Features

### Charts Included:
1. **Line Charts**: GPU utilization over time (by facility)
2. **Bar Charts**: Daily revenue (BTC mining vs AI inference)
3. **Pie Charts**: Spending breakdown by workload type
4. **Progress Bars**: Budget utilization, facility utilization
5. **KPI Cards**: Revenue, GPU util, workload count, alerts
6. **Tables**: Workloads, billing, resources, customers, alerts, invoices

---

## ✅ Development Plan Coverage

All major use cases from the development plan are now represented:

- [x] **Sprint 0-1**: Multi-tenant architecture (8 customers)
- [x] **Sprint 2**: Economic optimization (BTC price, electricity rates, profitability)
- [x] **Sprint 3**: Workload router (priorities, queue management)
- [x] **Sprint 4-5**: Resource management (GPU/ASIC inventory, allocation)
- [x] **Sprint 6-7**: Monitoring & observability (real-time metrics, alerts)
- [x] **Sprint 8-9**: Customer portal (workload submission, budget tracking)
- [x] **Sprint 10-11**: Billing system (multi-tenant, invoices, usage tracking)
- [x] **Sprint 12**: Alert management (severity levels, acknowledgement)
- [x] **Sprint 13**: Hybrid compute (BTC mining, AI inference, switching logic)

---

**🎉 Ready to visualize!** All synthetic data is now loaded and the prototype accurately demonstrates the differences between Admin and Customer views!

