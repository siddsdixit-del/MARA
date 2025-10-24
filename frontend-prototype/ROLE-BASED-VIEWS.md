# 🎭 Role-Based Views - MARA HCP Prototype

## Overview
The prototype now supports **TWO complete portals** with role-based authentication:
1. **Admin Portal** - For MARA internal operations team
2. **Customer Portal** - For external customers using the platform

## 🔄 Quick Start: Switching Between Views

### Method 1: Login Page
1. Go to `http://localhost:3000/login`
2. Select role using the toggle buttons:
   - 👤 **Customer** - See customer portal
   - 🛡️ **Admin** - See admin portal
3. Click "Sign In" (no password required in prototype)

### Method 2: Live Toggle (While Logged In)
- Look for the **floating role switcher** in the top-right corner
- Click to toggle between **Admin** and **Customer** views in real-time
- The entire UI will update instantly with role-specific views

---

## 🛡️ ADMIN PORTAL

### Purpose
**For**: MARA Internal Team (Operations, Executives, Infrastructure Management)  
**Scope**: Platform-wide visibility across ALL customers and facilities

### Admin Dashboard Features
✅ **Platform-Wide Metrics**
- Total revenue across all customers ($127,432)
- Overall GPU utilization across all facilities (94.2%)
- Total active workloads from all customers (142)
- All facility performance (Texas-1, Texas-2, Canada-1)

✅ **Real-Time Monitoring**
- Live GPU utilization chart (platform-wide)
- Real-time energy cost tracking
- Bitcoin price monitoring
- System health status

✅ **Customer Management**
- View all customer workloads
- See billing across all accounts
- Monitor resource allocation per customer
- System-wide alerts and incidents

### Admin Navigation Menu
```
📊 Dashboard       → Platform overview
🖥️  Resources      → All 10,000+ GPUs across facilities
📦 Workloads       → All customer workloads (142 active)
💰 Billing         → Platform-wide billing & revenue
🚨 Alerts          → System alerts & incidents (12 active)
⚙️  Settings       → System configuration
```

### Admin-Only Features
- **Resource Management**: Browse and manage all GPU/ASIC resources
- **Facility View**: See which facility each resource belongs to
- **Cross-Customer Analytics**: Aggregate data across all customers
- **Infrastructure Control**: System configuration and management
- **All Workloads**: View every workload from every customer

---

## 👤 CUSTOMER PORTAL

### Purpose
**For**: External Customers (Acme Corp, TechCo, DataCorp, etc.)  
**Scope**: Single-customer view - ONLY their own data

### Customer Dashboard Features
✅ **Personal Metrics**
- Their monthly spending ($12,450)
- Their GPU utilization (89%)
- Their active workloads (8)
- Their budget status (66.4% used)

✅ **Resource Usage**
- Their allocated GPUs only
- Their workload performance
- Their spending trends
- Budget alerts

✅ **Simplified Interface**
- No facility details (abstracted away)
- No other customers' data
- Focus on workload submission and monitoring
- Easy-to-understand billing

### Customer Navigation Menu
```
📊 Dashboard          → Personal overview
📦 My Workloads       → Their 8 workloads only
💰 Billing & Usage    → Their spending & invoices
⚙️  Settings          → Account settings, API keys
❓ Help & Support     → FAQs, documentation, tickets
```

### Customer-Only Features
- **Submit New Workload**: Big CTA button on dashboard
- **Budget Tracking**: Visual progress bar for monthly budget
- **Quick Actions**: Streamlined workflow for common tasks
- **Help & Support**: Access to documentation and support tickets
- **API Keys**: Manage their API authentication

---

## 🎨 Visual Differences

| Feature | Admin View | Customer View |
|---------|-----------|---------------|
| **Sidebar Label** | 🔴 "Admin Portal" | 🔵 "Customer Portal" |
| **Company Name** | "MARA Holdings" | "Acme Corporation" |
| **User Name** | "Admin User" | "John Doe" |
| **Email** | admin@mara.com | john@acme.com |
| **Notification Badge** | 12 alerts | 3 alerts |
| **Primary Color** | Red accent | Blue accent |

---

## 📊 Dashboard Comparison

### Admin Dashboard
```
┌─────────────────────────────────────────────────────┐
│  Executive Dashboard                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ $127,432 │ │  94.2%   │ │    142   │ │ 10,248   ││
│  │  Revenue │ │ GPU Util │ │Workloads │ │  GPUs    ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                       │
│  📈 Platform-Wide GPU Utilization (Last 24h)        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                       │
│  📋 Active Workloads Across All Customers            │
│  ┌─────────┬──────────┬────────┬──────────┐        │
│  │wl-001   │Acme Corp │Running │8x H100   │        │
│  │wl-002   │TechCo    │Running │4x L40S   │        │
│  │wl-003   │DataCorp  │Queued  │Pending   │        │
│  └─────────┴──────────┴────────┴──────────┘        │
└─────────────────────────────────────────────────────┘
```

### Customer Dashboard
```
┌─────────────────────────────────────────────────────┐
│  My Dashboard                [Submit New Workload]  │
│  Acme Corporation                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ $12,450  │ │   89%    │ │     8    │ │ $18,750  ││
│  │This Month│ │  My GPU  │ │    My    │ │  Est.    ││
│  │  Spend   │ │   Util   │ │Workloads │ │Month-End ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                       │
│  📈 My Resource Utilization & Spending (24h)        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                       │
│  📋 My Active Workloads (8)                          │
│  ┌─────────┬────────────┬────────┬──────────┐      │
│  │wl-abc123│AI Inference│Running │8x H100   │      │
│  │wl-xyz789│Model Train │Running │4x H100   │      │
│  │wl-mno345│AI Inference│Queued  │Pending   │      │
│  └─────────┴────────────┴────────┴──────────┘      │
│                                                       │
│  📊 Budget Status: 66.4% used ━━━━━━━━━━░░░░        │
│  ✓ On track to stay within budget                   │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Context

The prototype uses React Context API for role management:

```javascript
// Current user state
{
  name: "John Doe" or "Admin User",
  email: "john@acme.com" or "admin@mara.com",
  role: "customer" or "admin",
  company: "Acme Corporation" or "MARA Holdings"
}
```

### Key Files
- `src/context/AuthContext.jsx` - User state management
- `src/components/RoleSwitcher.jsx` - Floating toggle component
- `src/components/Layout.jsx` - Role-based navigation
- `src/App.jsx` - Role-based routing
- `src/pages/CustomerDashboard.jsx` - Customer-specific dashboard
- `src/pages/Dashboard.jsx` - Admin dashboard
- `src/pages/Help.jsx` - Customer support page

---

## 🎯 What Each Role Can See

### Admin Can Access
✅ Dashboard (platform-wide)
✅ Resources (all GPUs/ASICs)
✅ Workloads (all customers)
✅ Billing (all accounts)
✅ Alerts (system-wide)
✅ Settings (system config)

### Customer Can Access
✅ Dashboard (personal metrics)
✅ My Workloads (their jobs only)
✅ Billing & Usage (their account)
✅ Settings (API keys, account)
✅ Help & Support (docs, tickets)

### Customer CANNOT Access
❌ Resources page (no facility browsing)
❌ Other customers' workloads
❌ Platform-wide metrics
❌ System alerts
❌ Infrastructure management

---

## 🚀 Try It Now!

1. **Visit**: `http://localhost:3000`
2. **Login as Customer**: See workload-centric interface
3. **Toggle to Admin**: See platform-wide management view
4. **Navigate Around**: Notice different menus and data
5. **Check Details**: Click into workloads, billing, etc.

---

## 💡 Key UX Differences

### Admin Experience
- **Information-dense**: Lots of metrics and data
- **Cross-customer view**: See all accounts
- **Facility-aware**: Know which data center resources are in
- **Infrastructure focus**: Manage GPUs, ASICs, power, cooling
- **Ops-oriented**: System health, alerts, incidents

### Customer Experience
- **Simplified**: Focus on their work
- **Self-service**: Easy workload submission
- **Budget-aware**: Clear spending visibility
- **No complexity**: Don't need to know about facilities
- **Support-first**: Easy access to help

---

## 🎨 Next Steps for Production

When implementing in production, you'll add:

1. **Real Authentication**
   - OAuth 2.0 / JWT tokens
   - Password hashing (bcrypt)
   - MFA support
   - Session management

2. **Role-Based Access Control (RBAC)**
   - Database-backed permissions
   - Fine-grained access control
   - API endpoint protection
   - Audit logging

3. **Multi-Tenant Data Isolation**
   - Database row-level security
   - Customer data segregation
   - Encrypted data at rest
   - Compliance (SOC 2, ISO 27001)

4. **Additional Roles**
   - Super Admin (full access)
   - Facility Manager (specific data center)
   - Customer Admin (team management)
   - Customer User (limited access)
   - Billing Admin (finance only)

---

## 📝 Implementation Notes

The prototype demonstrates the UX/UI differences between portals without actual authentication. In production:

- Replace `AuthContext` with real auth service (Auth0, Cognito, etc.)
- Add API middleware to enforce permissions
- Implement database-level tenant isolation
- Add role-based API endpoints
- Enable audit logging for compliance

---

**Ready to visualize both experiences!** 🎉

The server is running at `http://localhost:3000` - just reload the page to see the role switcher in action!

