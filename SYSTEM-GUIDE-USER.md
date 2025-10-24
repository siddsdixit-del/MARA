# MARA HCP - Complete User Guide

**Version:** 1.0  
**Last Updated:** October 24, 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Portal Guide](#admin-portal-guide)
3. [Customer Portal Guide](#customer-portal-guide)
4. [Common Tasks](#common-tasks)
5. [Understanding Your Dashboard](#understanding-your-dashboard)
6. [Billing & Cost Management](#billing--cost-management)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Portal

Navigate to: **http://localhost:3001**

You'll see the MARA HCP landing page with:
- Platform overview
- Feature highlights
- Login/Register options

### Login Credentials

**For Administrators:**
```
Email: admin@mara.com
Password: admin123
```

**For Customers:**
```
Email: john@acme.com
Password: customer123
```

### First Time Login

After logging in, you'll be redirected to your role-specific dashboard:
- **Admins** → Platform-wide operations dashboard
- **Customers** → Personal usage dashboard

---

## Admin Portal Guide

### Overview

The Admin Portal provides complete visibility and control over the entire MARA HCP platform.

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ADMIN DASHBOARD                                     [Notifications] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  KPI CARDS (Top Row)                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│  │   Revenue    │ │  Resources   │ │  Workloads   │              │
│  │  $284,567    │ │    896/896   │ │     1,247    │              │
│  │  +12.3% ▲    │ │     100%     │ │   +23 today  │              │
│  └──────────────┘ └──────────────┘ └──────────────┘              │
│                                                                     │
│  FACILITY STATUS                                                   │
│  ┌───────────────────────────────────────────────────────┐        │
│  │ Texas North:  ⚡ 100 MW  │  🔥 48°C  │  ✅ Operational │        │
│  │ Texas South:  ⚡ 75 MW   │  🔥 52°C  │  ✅ Operational │        │
│  │ North Dakota: ⚡ 50 MW   │  🔥 45°C  │  ⚠️  Maintenance│        │
│  └───────────────────────────────────────────────────────┘        │
│                                                                     │
│  REVENUE TRENDS (Chart)                                            │
│  ┌───────────────────────────────────────────────────────┐        │
│  │                          ╱╲                            │        │
│  │                    ╱╲   ╱  ╲      ╱╲                  │        │
│  │              ╱╲   ╱  ╲ ╱    ╲    ╱  ╲                 │        │
│  │         ╱╲  ╱  ╲ ╱    ╲      ╲  ╱    ╲                │        │
│  │    ╱───╱  ╲╱    ╲      ╲──────╲╱      ╲───            │        │
│  │───╱                                        ╲──────────│        │
│  │  Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct    │        │
│  └───────────────────────────────────────────────────────┘        │
│                                                                     │
│  RECENT WORKLOADS                                                  │
│  ┌─────┬────────────┬──────────┬──────────┬─────────────┐        │
│  │ ID  │ Customer   │ Type     │ Status   │ Revenue     │        │
│  ├─────┼────────────┼──────────┼──────────┼─────────────┤        │
│  │ W1  │ Acme Corp  │ AI Inf.  │ Running  │ $45.20/hr   │        │
│  │ W2  │ Beta Sol.  │ Training │ Queued   │ $120.00/hr  │        │
│  │ W3  │ Gamma Inc. │ Mining   │ Running  │ $8.50/hr    │        │
│  └─────┴────────────┴──────────┴──────────┴─────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Metrics Explained

#### Platform Revenue
- **24-hour revenue** from all customers
- **Trend indicator**: Green ▲ for increase, Red ▼ for decrease
- **Click for details**: Breakdown by workload type (Mining vs. AI)

#### Active Resources
- **Numerator**: Currently utilized resources
- **Denominator**: Total available resources
- **Utilization %**: Target is >90% for optimal profitability

#### Active Workloads
- **Total count** of running and queued workloads
- **Today's change**: New workloads submitted today
- **Click for list**: Full workload queue with priorities

### Resources Page

**Navigation:** Resources → View All

```
┌─────────────────────────────────────────────────────────────────┐
│ RESOURCE INVENTORY                          [Filter] [Search]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FILTERS:                                                       │
│  [ ] GPUs (896)    [ ] ASICs (33,000)    [ ] CPUs (128)       │
│  [ ] Texas North   [ ] Texas South       [ ] North Dakota     │
│  [ ] Available     [ ] Allocated         [ ] Maintenance      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ GPU-TX-H100-001                          ✅ AVAILABLE   │  │
│  │ ─────────────────────────────────────────────────────── │  │
│  │ Type: NVIDIA H100 80GB                                  │  │
│  │ Location: Texas North - Rack 3A                         │  │
│  │ Temperature: 48°C   Power: 420W   Utilization: 0%      │  │
│  │ Last Workload: AI Training (ended 15 min ago)          │  │
│  │                                    [View Details]       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ ASIC-TX-S21-0042                      🔄 ALLOCATED      │  │
│  │ ─────────────────────────────────────────────────────── │  │
│  │ Type: Antminer S21 200 TH/s                             │  │
│  │ Location: Texas North - Container 12                    │  │
│  │ Hash Rate: 198.5 TH/s   Power: 3,475W   Temp: 62°C    │  │
│  │ Current Workload: Bitcoin Mining (Gamma Inc.)           │  │
│  │ Uptime: 14d 6h 23m                [View Details]        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Resource Details View

Click any resource to see:

**GPU Details:**
- **Specifications**: Memory, compute capability, CUDA cores
- **Real-time metrics**: Temperature, power, utilization (updated every 5s)
- **Workload history**: Last 10 workloads executed
- **Health status**: Error counts, thermal throttling events
- **Performance**: Average utilization over 24h, 7d, 30d

**ASIC Details:**
- **Specifications**: Model, hash rate, efficiency (J/TH)
- **Mining metrics**: Hash rate, shares submitted, pool stats
- **Health status**: Temperature, fan speed, chip count
- **Earnings**: BTC mined (estimated), revenue generated

#### Common Resource Actions

**For Admins:**
- **Put in Maintenance Mode**: Temporarily removes from allocation pool
- **Force Release**: Terminate current workload (emergency only)
- **View Logs**: Access hardware logs for troubleshooting
- **Run Diagnostics**: Execute hardware health check

### Workloads Page

**Navigation:** Workloads → View All

```
┌───────────────────────────────────────────────────────────────────┐
│ WORKLOAD MANAGEMENT                  [Filter] [Search] [Export]  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  QUEUE OVERVIEW:                                                  │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │    P1       │     P2      │     P3      │     P4      │      │
│  │ Real-time   │   Batch     │  Training   │   Mining    │      │
│  │   3 jobs    │   12 jobs   │   5 jobs    │   Running   │      │
│  │  <100ms     │   <5min     │   <30min    │   Always    │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│  ACTIVE WORKLOADS:                                                │
│  ┌────┬─────────┬───────────┬──────┬─────────┬─────────┬───┐   │
│  │ID  │Customer │Type       │Pri   │Status   │Resource │$  │   │
│  ├────┼─────────┼───────────┼──────┼─────────┼─────────┼───┤   │
│  │W1  │Acme     │AI Inf RT  │P1 🔴 │Running  │H100-001 │$45│   │
│  │W2  │Beta     │Training   │P2 🟡 │Queued   │-        │$120│  │
│  │W3  │Gamma    │Mining     │P4 🔵 │Running  │S21-0042 │$9 │   │
│  │W4  │Acme     │AI Batch   │P2 🟡 │Running  │A100-023 │$32│   │
│  │W5  │Delta    │AI Inf RT  │P1 🔴 │Queued   │-        │$50│   │
│  └────┴─────────┴───────────┴──────┴─────────┴─────────┴───┘   │
│                                                                   │
│  RECENT COMPLETIONS:                                              │
│  ┌────┬─────────┬───────────┬──────────┬──────────┬─────────┐  │
│  │ID  │Customer │Duration   │Avg Lat   │SLA Met?  │Revenue  │  │
│  ├────┼─────────┼───────────┼──────────┼──────────┼─────────┤  │
│  │W87 │Acme     │2.5 hrs    │27ms      │✅ Yes    │$112.50  │  │
│  │W86 │Beta     │18 hrs     │N/A       │✅ Yes    │$2,160   │  │
│  └────┴─────────┴───────────┴──────────┴──────────┴─────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

#### Understanding Priorities

| Priority | Type | Max Latency | Use Case | Example |
|----------|------|-------------|----------|---------|
| **P1** 🔴 | Real-time | <50ms | Live inference | Chatbots, APIs |
| **P2** 🟡 | Batch | <5min | Batch processing | Image analysis |
| **P3** 🟠 | Training | <30min | Model training | Deep learning |
| **P4** 🔵 | Mining | Always on | Bitcoin mining | Background fill |

#### Workload Actions

**View Details:**
- Real-time metrics (latency, throughput)
- Resource allocation
- Cost accrual
- Logs and errors

**Modify Priority:**
- Admins can boost customer priority (emergency SLA breach)
- Requires justification

**Terminate:**
- Emergency stop
- Customer is charged for partial execution
- Notifies customer immediately

### Billing Page

**Navigation:** Billing → Overview

```
┌──────────────────────────────────────────────────────────────────┐
│ BILLING & REVENUE                              [Export] [Search] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  REVENUE SUMMARY (October 2025):                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Total Revenue:        $284,567.00                       │  │
│  │  AI Inference:         $198,234.00  (69.6%)             │  │
│  │  Model Training:       $72,890.00   (25.6%)             │  │
│  │  Bitcoin Mining:       $13,443.00   (4.7%)              │  │
│  │                                                           │  │
│  │  vs. Last Month:       +$32,123  (+12.7%) ▲             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  TOP CUSTOMERS (by Revenue):                                    │
│  ┌────┬──────────────┬──────────────┬───────────┬──────────┐  │
│  │ #  │ Customer     │ This Month   │ Workloads │ Avg $/hr │  │
│  ├────┼──────────────┼──────────────┼───────────┼──────────┤  │
│  │ 1  │ Acme Corp    │ $89,234.00   │   423     │  $45.20  │  │
│  │ 2  │ Beta Solut.  │ $67,890.00   │   187     │  $98.50  │  │
│  │ 3  │ Gamma Inc.   │ $45,678.00   │ 1,247     │  $8.75   │  │
│  │ 4  │ Delta AI     │ $38,234.00   │   234     │  $72.30  │  │
│  │ 5  │ Epsilon ML   │ $28,945.00   │   156     │  $62.10  │  │
│  └────┴──────────────┴──────────────┴───────────┴──────────┘  │
│                                                                  │
│  PAYMENT STATUS:                                                 │
│  ┌────┬──────────────┬────────────┬──────────┬─────────────┐   │
│  │ ID │ Customer     │ Amount     │ Due Date │ Status      │   │
│  ├────┼──────────────┼────────────┼──────────┼─────────────┤   │
│  │ I1 │ Acme Corp    │ $89,234.00 │ Nov 1    │ ✅ Paid     │   │
│  │ I2 │ Beta Solut.  │ $67,890.00 │ Nov 1    │ ⏳ Pending  │   │
│  │ I3 │ Gamma Inc.   │ $45,678.00 │ Nov 1    │ ⚠️ Overdue  │   │
│  └────┴──────────────┴────────────┴──────────┴─────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Revenue Analytics

**Charts Available:**
- Revenue trends (daily, weekly, monthly)
- Workload type breakdown (AI vs. Mining)
- Customer segmentation
- Resource utilization vs. revenue
- Peak hours analysis

**Export Options:**
- CSV, Excel, PDF
- Custom date ranges
- Per-customer reports
- Quarterly summaries for finance

### Alerts Page

**Navigation:** Alerts → View All

```
┌──────────────────────────────────────────────────────────────┐
│ SYSTEM ALERTS                          [Filter] [Mark Read]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🔴 CRITICAL (3)                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ⚠️  High Temperature Alert                           │  │
│  │ GPU-TX-H100-087 reached 89°C (limit: 85°C)         │  │
│  │ 5 minutes ago                     [View] [Dismiss]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  🟡 WARNING (12)                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📊 High Queue Depth                                  │  │
│  │ P1 queue has 8 workloads (limit: 5)                │  │
│  │ 2 hours ago                       [View] [Dismiss]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ℹ️  INFO (45)                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✅ Workload Completed Successfully                   │  │
│  │ W87 (Acme Corp) finished - SLA met                  │  │
│  │ 10 minutes ago                    [View] [Dismiss]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Alert Types

| Severity | Type | Examples | Action Required |
|----------|------|----------|----------------|
| 🔴 Critical | Hardware failure, SLA breach | GPU offline, workload failed | Immediate |
| 🟡 Warning | Performance degradation | High temp, queue depth | Monitor |
| ℹ️ Info | Status updates | Workload complete, updates | None |

---

## Customer Portal Guide

### Overview

The Customer Portal provides self-service access to submit workloads, monitor usage, and manage billing.

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ CUSTOMER DASHBOARD                              [Notifications]  │
│ Acme Corporation                                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  YOUR KPIS:                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ This Month   │ │ Active Jobs  │ │   Budget     │            │
│  │  $7,234.50   │ │      12      │ │ 67% used     │            │
│  │  vs $6,890   │ │   3 queued   │ │ $3,265 left  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  BUDGET STATUS:                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ████████████████████████░░░░░░░░░░░  67%                │  │
│  │ $6,734.50 / $10,000.00 monthly budget                    │  │
│  │ 📅 Resets in 7 days                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  YOUR WORKLOADS:                                                 │
│  ┌────┬────────────────┬─────────┬──────────┬─────────────┐    │
│  │ ID │ Type           │ Status  │ Resource │ Cost/hr     │    │
│  ├────┼────────────────┼─────────┼──────────┼─────────────┤    │
│  │ W1 │ AI Inference   │ Running │ H100-001 │ $45.20      │    │
│  │ W4 │ Batch Process  │ Running │ A100-023 │ $32.00      │    │
│  │ W5 │ AI Inference   │ Queued  │ -        │ $50.00      │    │
│  └────┴────────────────┴─────────┴──────────┴─────────────┘    │
│                                                                  │
│  [+ Submit New Workload]                                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Submitting a Workload

**Click:** "Submit New Workload" button

```
┌──────────────────────────────────────────────────────────────┐
│ SUBMIT NEW WORKLOAD                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  WORKLOAD TYPE:                                              │
│  ○ Real-time AI Inference  (Priority 1 - <50ms)             │
│  ○ Batch AI Inference      (Priority 2 - <5min)             │
│  ○ Model Training          (Priority 3 - hours/days)        │
│                                                              │
│  GPU REQUIREMENTS:                                           │
│  GPU Type:     [▼ H100 80GB]                                │
│  GPU Count:    [1]                                           │
│  Duration:     [2] hours                                     │
│                                                              │
│  AI MODEL:                                                   │
│  Model:        [▼ Llama-3-70B]                              │
│  Framework:    [▼ PyTorch]                                  │
│  Memory Req:   [78 GB]                                       │
│                                                              │
│  SLA REQUIREMENTS:                                           │
│  Max Latency:  [50] ms                                       │
│  Min Throughput: [40] requests/sec                          │
│                                                              │
│  ESTIMATED COST:                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ GPU: H100 80GB x 1                                     │ │
│  │ Duration: 2 hours                                      │ │
│  │ Rate: $45.20/hour                                      │ │
│  │                                                        │ │
│  │ Total: $90.40                                          │ │
│  │                                                        │ │
│  │ Your Budget: $10,000.00                                │ │
│  │ Used: $6,734.50                                        │ │
│  │ After: $6,824.90 (68.2%)                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Cancel]                               [Submit Workload] ← │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Guide

**1. Choose Workload Type**
- **Real-time**: For live APIs, chatbots (P1 priority)
- **Batch**: For large-scale processing (P2 priority)
- **Training**: For model development (P3 priority)

**2. Specify GPU Requirements**
- **GPU Type**: H100 (fastest), A100 (balanced), L40S (cost-effective)
- **GPU Count**: 1-16 (depends on model parallelism needs)
- **Duration**: Estimate conservatively (charged by actual usage)

**3. Select AI Model**
- Choose from pre-loaded models OR
- Upload custom model (Docker image with inference server)

**4. Set SLA Requirements**
- **Latency**: How fast each request must complete
- **Throughput**: Requests per second needed
- System auto-rejects if SLA cannot be guaranteed

**5. Review Cost Estimate**
- Real-time calculation based on current rates
- Includes all charges (GPU, network, storage)
- Checks against your budget limit

**6. Submit**
- Workload enters queue immediately
- You receive email confirmation
- Dashboard updates in real-time

### Monitoring Your Workloads

**Navigation:** My Workloads → Active

```
┌──────────────────────────────────────────────────────────────┐
│ WORKLOAD W1 - AI INFERENCE (RUNNING)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  STATUS: 🟢 Running                                          │
│  Started: 2 hours 15 min ago                                │
│  Est. Completion: 12 min (at 2hr mark)                      │
│                                                              │
│  RESOURCE:                                                   │
│  GPU: H100-001 (Texas North)                                │
│  Utilization: 95%  ┃▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇░┃                   │
│  Temperature: 68°C                                           │
│                                                              │
│  PERFORMANCE:                                                │
│  Requests Processed: 289,234                                │
│  Average Latency: 27 ms  (SLA: <50ms) ✅                    │
│  Throughput: 42 req/sec  (SLA: >40 req/sec) ✅              │
│                                                              │
│  COST:                                                       │
│  Rate: $45.20/hour                                           │
│  Elapsed: 2.25 hours                                         │
│  Current Charge: $101.70                                     │
│  Projected Total: $90.40 (2 hours)                          │
│                                                              │
│  REAL-TIME METRICS:                                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Latency (ms)        Requests/sec                   │     │
│  │   50│                     50│                       │     │
│  │   40│     ╱╲                40│      ╱─╲╱─╲       │     │
│  │   30│    ╱  ╲   ╱╲         30│     ╱      ╲      │     │
│  │   20│ ╱╲╱    ╲ ╱  ╲╱╲      20│   ╱╲       ╲╱╲   │     │
│  │   10│╱        ╲      ╲     10│ ╱╲  ╲          ╲  │     │
│  │    0└──────────────────     0└──────────────────  │     │
│  │      12:00  12:30  13:00      12:00  12:30  13:00│     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  [View Logs] [Extend Duration] [Terminate]                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Understanding Metrics

**Utilization:**
- **Goal:** >90% (you're fully using the GPU)
- **Low (<70%):** Consider downsizing GPU type
- **High (>95%):** Good efficiency

**Latency:**
- Must stay below your SLA threshold
- Spikes may indicate:
  - Network congestion
  - Input data issues
  - Model complexity

**Cost Projection:**
- Updates every minute
- Includes actual usage (charged by the second)
- Can extend duration mid-execution

### My Billing

**Navigation:** Billing & Usage

```
┌──────────────────────────────────────────────────────────────┐
│ BILLING & USAGE                                [Download]    │
│ Acme Corporation                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CURRENT MONTH (October 2025):                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Total Spending:  $7,234.50                             │ │
│  │ Budget Limit:    $10,000.00                            │ │
│  │ Remaining:       $2,765.50  (28%)                      │ │
│  │ vs Last Month:   +$344.50  (+5.0%)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  SPENDING BY TYPE:                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ AI Inference:    $5,234.00  (72.3%)  ████████████▒▒▒  │ │
│  │ Model Training:  $1,890.00  (26.1%)  ████░░░░░░░░░░  │ │
│  │ Batch Jobs:      $110.50    (1.5%)   ░░░░░░░░░░░░░░  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  DAILY SPENDING (Last 30 days):                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ $500│                                       ╱╲          │ │
│  │ $400│                              ╱╲      ╱  ╲        │ │
│  │ $300│                     ╱╲      ╱  ╲   ╱    ╲       │ │
│  │ $200│            ╱╲      ╱  ╲    ╱    ╲ ╱      ╲      │ │
│  │ $100│   ╱╲      ╱  ╲    ╱    ╲  ╱      ╲        ╲     │ │
│  │   $0└───────────────────────────────────────────────   │ │
│  │      Oct 1      Oct 10      Oct 20      Oct 30        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  INVOICES:                                                   │
│  ┌────┬────────────┬──────────┬─────────┬──────────────┐   │
│  │ #  │ Month      │ Amount   │ Paid    │ Status       │   │
│  ├────┼────────────┼──────────┼─────────┼──────────────┤   │
│  │ 1  │ Oct 2025   │ $7,234.50│ -       │ 📊 Current   │   │
│  │ 2  │ Sep 2025   │ $6,890.00│ Oct 5   │ ✅ Paid      │   │
│  │ 3  │ Aug 2025   │ $5,432.00│ Sep 3   │ ✅ Paid      │   │
│  └────┴────────────┴──────────┴─────────┴──────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Cost Optimization Tips

**1. Choose Right GPU Type**
- H100: For cutting-edge models, real-time inference
- A100: For most production workloads
- L40S: For development and testing

**2. Batch When Possible**
- Batch inference is 30-40% cheaper than real-time
- Use for non-urgent processing

**3. Monitor Utilization**
- Low utilization? Downsize GPU type
- Optimize batch size for GPU memory

**4. Set Budget Alerts**
- Configure alerts at 50%, 75%, 90% of budget
- Receive email + SMS notifications

---

## Common Tasks

### Admin: Responding to High Temperature Alert

**1. Receive Alert**
```
🔴 CRITICAL: GPU-TX-H100-087 reached 89°C
```

**2. Navigate to Resource**
- Click alert → "View Details"
- Or: Resources → Search "H100-087"

**3. Assess Situation**
- Check current workload (is it terminating soon?)
- Review temperature trend (rising or stable?)
- Check facility HVAC status

**4. Take Action**
- **If workload ending soon (<10 min):** Monitor
- **If temperature still rising:** Terminate workload, put GPU in maintenance
- **If facility issue:** Contact datacenter operations

**5. Document**
- Add notes to alert
- Mark as resolved
- Schedule hardware inspection

### Customer: Extending a Running Workload

**1. Navigate to Workload**
- Dashboard → "Your Workloads" → Click workload ID

**2. Click "Extend Duration"**
```
┌────────────────────────────────────────┐
│ EXTEND WORKLOAD W1                     │
├────────────────────────────────────────┤
│ Current: 2 hours (12 min remaining)    │
│ Extend by: [▼ 1 hour]                 │
│                                        │
│ Additional Cost: $45.20                │
│ New Total: $135.60                     │
│                                        │
│ Budget Check: ✅ Within limit          │
│                                        │
│ [Cancel]          [Confirm Extension]  │
└────────────────────────────────────────┘
```

**3. Confirm**
- Workload continues seamlessly
- No downtime or switching
- Charged for additional time

### Admin: Manually Routing a Workload

**For emergency priority boost or resource constraints:**

**1. Workloads → Queue Status**

**2. Find Workload → Click "Actions" → "Manual Route"**

**3. Select Specific Resource**
```
Available H100 GPUs:
○ H100-001 (Texas North)  - Score: 95
○ H100-002 (Texas North)  - Score: 93
● H100-023 (Texas South)  - Score: 87  ← Selected
```

**4. Override Reason**
```
Reason: Customer SLA breach imminent
Approved by: Admin User
```

**5. Confirm**
- Workload routes immediately
- Normal queue order bypassed
- Audit log entry created

---

## Understanding Your Dashboard

### Real-time Updates

Both Admin and Customer dashboards use **WebSocket** for live updates:

- **Metrics refresh:** Every 5 seconds
- **Status changes:** Instant (workload start/stop)
- **Alerts:** Instant notification
- **Connection status:** Indicator in top-right corner
  - 🟢 Connected
  - 🟡 Reconnecting
  - 🔴 Disconnected (refresh page)

### Data Freshness

| Data Type | Update Frequency | Source |
|-----------|-----------------|---------|
| KPI Cards | 15 seconds | PostgreSQL aggregate |
| Charts | 1 minute | TimescaleDB |
| Resource Metrics | 5 seconds | Prometheus |
| Workload Status | Real-time | WebSocket |
| Alerts | Real-time | WebSocket |

---

## Billing & Cost Management

### Pricing Model

#### GPU Rates (per GPU per hour)

| GPU Type | Memory | Real-time | Batch | Training |
|----------|--------|-----------|-------|----------|
| H100 | 80GB | $45.20 | $36.00 | $40.00 |
| A100 | 40GB | $32.00 | $25.00 | $28.00 |
| L40S | 48GB | $18.50 | $15.00 | $16.50 |

#### Bitcoin Mining Rates

- **Variable pricing** based on profitability
- Typically: $8-12/ASIC/hour (200 TH/s)
- Auto-switches to AI when more profitable

#### Additional Charges

- **Network egress:** $0.08/GB (first 10GB free per workload)
- **Storage:** $0.02/GB/day for model/data storage
- **Support:** Enterprise: $500/month, Pro: $100/month

### Budget Management

**Setting a Budget:**
1. Settings → Billing → Set Monthly Budget
2. Enter amount (e.g., $10,000)
3. Configure alerts (50%, 75%, 90%)

**Budget Alerts:**
- Email + SMS notifications
- Option to pause new workloads at 100%
- Carryover unused budget (optional)

**Overage Protection:**
- Hard cap: System rejects new workloads
- Soft cap: Admins can approve overages

---

## Troubleshooting

### "Workload stuck in Queued status"

**Symptoms:** Workload in queue for >5 minutes (P1), >30 minutes (P2/P3)

**Causes & Solutions:**

1. **No available resources**
   - Check Resources page for availability
   - Consider lower-priority GPU type
   - Wait for current workloads to complete

2. **SLA requirements too strict**
   - Review latency/throughput requirements
   - System may reject impossible SLAs
   - Contact support for feasibility analysis

3. **Budget limit reached**
   - Check Billing page
   - Increase budget or wait for month reset
   - Remove budget cap (if authorized)

### "High latency on running workload"

**Symptoms:** Latency >SLA threshold, spikes in metrics

**Quick Checks:**

1. **GPU Utilization**
   - Low (<70%): Input data bottleneck
   - High (>98%): Model too complex for GPU

2. **Network**
   - Check egress bandwidth
   - May need closer facility (geo-routing)

3. **Input Data**
   - Large inputs increase latency
   - Batch multiple small requests

**Actions:**
- Extend duration to avoid rushing
- Consider upgrading GPU type
- Review model optimization

### "Cannot login / Authentication error"

**Issue:** Login fails or session expires

**Solutions:**

1. **Clear browser cache:**
   - Chrome/Edge: Cmd+Shift+Delete (Mac), Ctrl+Shift+Delete (Windows)
   - Safari: Cmd+Option+E

2. **Try incognito/private mode:**
   - Eliminates cache issues

3. **Check credentials:**
   - Email case-sensitive
   - Password case-sensitive
   - No extra spaces

4. **Reset password:**
   - Login page → "Forgot password"
   - Check email for reset link

### "Dashboard not updating"

**Symptoms:** Stale data, metrics not refreshing

**Check:**

1. **WebSocket connection status** (top-right corner)
   - Should be 🟢 green
   - If 🔴 red: Refresh page

2. **Browser console** (F12)
   - Look for errors
   - WebSocket connection errors

3. **Service status**
   - Check https://status.mara.com
   - May be maintenance window

**Quick Fix:**
- Hard refresh: Cmd+Shift+R (Mac), Ctrl+Shift+R (Windows)
- Close and reopen browser

---

## Getting Help

### Support Channels

**Email:** support@mara.com  
**Response Time:** 
- Critical: <30 minutes
- Normal: <4 hours

**Live Chat:** Available 24/7 in dashboard (bottom-right corner)

**Phone:** 1-800-MARA-HCP (Critical issues only)

### Status Page

**https://status.mara.com**
- Real-time system status
- Scheduled maintenance
- Incident reports

### Documentation

- **Knowledge Base:** https://docs.mara.com
- **API Docs:** https://api-docs.mara.com
- **Video Tutorials:** https://learn.mara.com

---

*Last Updated: October 24, 2025*  
*Version: 1.0*  
*Need more help? Contact support@mara.com*

