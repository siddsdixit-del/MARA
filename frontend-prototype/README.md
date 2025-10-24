# MARA HCP - Frontend Prototype 🎭

This is a **complete visual prototype** of the MARA Hybrid Compute Platform (HCP) with **ROLE-BASED VIEWS**. Experience both the Admin Portal (for MARA's internal team) and the Customer Portal (for external clients).

## 🎭 Two Complete Portals in One!

### 🛡️ Admin Portal
**For**: MARA Internal Operations Team  
**Shows**: Platform-wide view across ALL customers
- Total revenue from all customers ($127K)
- All 10,000+ GPUs across all facilities (Texas-1, Texas-2, Canada-1)
- All 142 workloads from all customers
- System-wide alerts, infrastructure management
- Facility-level resource browsing

### 👤 Customer Portal
**For**: External Customers (Acme Corp, TechCo, etc.)  
**Shows**: Single-customer scoped view ONLY
- Their personal spending ($12.4K)
- Their 8 workloads only
- Their GPU allocation
- Budget tracking and alerts
- Help & Support center

### 🔄 Live Role Switching
- **Floating toggle** in top-right corner - switch between Admin/Customer instantly!
- **Login page** allows selecting role before entering
- **Entire UI updates** with role-specific navigation, data, and features

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 18.17.0 or higher)
- npm or yarn

### Installation & Run

1. **Navigate to the prototype directory**:
```bash
cd frontend-prototype
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser**:
```
http://localhost:3000
```

The app should automatically open!

---

## 🎯 Try Both Views

### Method 1: Select Role at Login
1. Go to `http://localhost:3000/login`
2. Toggle between **👤 Customer** or **🛡️ Admin**
3. Click "Sign In" (no password required in prototype)
4. Explore the role-specific dashboard!

### Method 2: Live Toggle (While Logged In)
1. Look for the **floating role switcher** in the top-right corner
2. Click to toggle between **Admin** and **Customer** views
3. Watch the entire UI update instantly:
   - Different navigation menu
   - Different dashboard layouts
   - Different data scopes
   - Different features

---

## 📱 What's Included

### All 13+ Screens from Design System

#### Authentication
- ✅ Login Page (with role selection)
- ✅ Register Page

#### Admin Portal Only
- ✅ Executive Dashboard (platform-wide metrics)
- ✅ Resource Browser (all 10K+ GPUs/ASICs)
- ✅ Resource Detail View (facility-specific)
- ✅ System Alerts (12 active incidents)

#### Customer Portal Only
- ✅ Customer Dashboard (personal metrics)
- ✅ Help & Support (FAQs, tickets)
- ✅ Budget Tracking (visual progress)

#### Shared (Scoped by Role)
- ✅ Workload List (all workloads vs their 8)
- ✅ Workload Detail View
- ✅ Billing Dashboard (platform vs personal)
- ✅ Settings (system vs account)

### Design Features
- 🎭 **Role-based UI** - Different UX for Admin vs Customer
- 🌙 **Dark mode first** - Material Design 3
- 📊 **Interactive charts** - Recharts with real-time feel
- 🎨 **Material-UI v5** - Custom theme
- 📱 **Fully responsive** - Mobile, tablet, desktop
- 🚀 **Vite HMR** - Instant updates
- 💅 **Modern gradients** - Blue/violet accent
- 🔔 **Role-specific badges** - Visual role indicators

---

## 🗺️ Navigation Guide

### Admin Navigation Menu
```
📊 Dashboard       → Platform-wide executive dashboard
🖥️  Resources      → Browse all 10K+ GPUs across facilities
📦 Workloads       → All customer workloads (142 active)
💰 Billing         → Platform revenue & all accounts
🚨 Alerts          → System alerts (12 critical/warning)
⚙️  Settings       → System configuration
```

### Customer Navigation Menu
```
📊 Dashboard          → Personal metrics & spending
📦 My Workloads       → Their 8 workloads only
💰 Billing & Usage    → Personal spending & invoices
⚙️  Settings          → API keys, account settings
❓ Help & Support     → FAQs, docs, support tickets
```

---

## 🎨 Visual Differences by Role

| Feature | Admin View | Customer View |
|---------|-----------|---------------|
| **Sidebar Badge** | 🔴 "Admin Portal" | 🔵 "Customer Portal" |
| **Company** | MARA Holdings | Acme Corporation |
| **User** | Admin User | John Doe |
| **Email** | admin@mara.com | john@acme.com |
| **Notifications** | 12 system alerts | 3 personal alerts |
| **Dashboard** | Platform-wide metrics | Personal metrics |
| **Resources Page** | ✅ Full access | ❌ Not available |
| **Workloads** | All 142 workloads | Only their 8 |
| **Billing** | All accounts | Their account only |
| **Help Page** | ❌ Not available | ✅ Support center |

---

## 🧪 Testing the Prototype

### Recommended Flow:

#### As Customer:
1. **Login** → Select "Customer" role → Sign In
2. **Dashboard** → See personal spending ($12.4K), 8 workloads
3. **Submit Workload** → Click big blue button
4. **My Workloads** → Click "wl-abc123" for details
5. **Billing** → See budget progress (66.4% used)
6. **Help** → Browse FAQs and submit ticket

#### As Admin:
1. **Toggle Role** → Use floating switcher → Select "Admin"
2. **Dashboard** → See platform-wide revenue ($127K), 142 workloads
3. **Resources** → Browse 10K+ GPUs, click "GPU-1234"
4. **Workloads** → See ALL customer workloads
5. **Billing** → View all accounts and revenue
6. **Alerts** → Manage 12 system incidents

#### Compare Views:
1. **Toggle between roles** while on same page
2. **Notice menu changes** (Resources, Help appear/disappear)
3. **Watch data scope change** (all vs personal)
4. **See badge colors change** (red vs blue)

---

## 📦 Project Structure

```
frontend-prototype/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Role-based navigation
│   │   └── RoleSwitcher.jsx     # Floating toggle component
│   ├── context/
│   │   └── AuthContext.jsx      # User role state management
│   ├── pages/
│   │   ├── Login.jsx            # Login with role selection
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx        # ADMIN dashboard
│   │   ├── CustomerDashboard.jsx  # CUSTOMER dashboard
│   │   ├── Resources.jsx        # Admin only
│   │   ├── ResourceDetail.jsx   # Admin only
│   │   ├── Workloads.jsx        # Scoped by role
│   │   ├── WorkloadDetail.jsx
│   │   ├── Billing.jsx          # Scoped by role
│   │   ├── Settings.jsx
│   │   ├── Alerts.jsx           # Scoped by role
│   │   └── Help.jsx             # Customer only
│   ├── theme.js                 # Material-UI dark theme
│   ├── App.jsx                  # Routing with role logic
│   └── main.jsx                 # Entry point
├── ROLE-BASED-VIEWS.md          # 📖 Complete role guide
├── QUICK-START.md
├── package.json
├── vite.config.js
└── README.md
```

---

## 📖 Documentation

- **[ROLE-BASED-VIEWS.md](./ROLE-BASED-VIEWS.md)** - Complete guide to Admin vs Customer portals
- **[QUICK-START.md](./QUICK-START.md)** - Installation and navigation guide

---

## 🎨 Design System

Implements the complete design system from `../design-system-and-ux.md`:

### Colors
- **Primary**: #3B82F6 (Blue) - Customer portal accent
- **Error**: #EF4444 (Red) - Admin portal accent
- **Secondary**: #8B5CF6 (Violet)
- **Success**: #10B981 (Emerald)
- **Warning**: #F59E0B (Amber)
- **Background**: #0A0A0A (Dark)
- **Paper**: #1A1A1A (Dark Gray)

### Typography
- **Font**: Inter
- **Headings**: 600-700 weight
- **Body**: 400 weight
- **Code**: Monospace

### Components
- Material-UI v5 with custom theme
- Recharts for data visualization
- Custom KPI cards, status indicators
- Gradient accents and micro-interactions

---

## 🔧 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🌟 Next Steps for Production

After reviewing the prototype:

### 1. Authentication & Authorization
- Replace `AuthContext` with OAuth 2.0 / JWT tokens
- Implement database-backed RBAC
- Add password hashing (bcrypt)
- Enable MFA support
- Add audit logging

### 2. Backend Integration
- Connect to real REST APIs
- Implement WebSocket for real-time updates
- Add GraphQL for efficient data fetching
- Integrate monitoring (Prometheus, DataDog)
- Set up API Gateway (Kong)

### 3. Multi-Tenant Data Isolation
- Database row-level security (RLS)
- Customer data segregation by tenant_id
- Encrypted data at rest (AES-256-GCM)
- Compliance (SOC 2, ISO 27001, GDPR)

### 4. Production Readiness
- State management (Redux Toolkit)
- Comprehensive error handling
- Unit tests (Jest) + E2E tests (Playwright)
- Performance optimization (code splitting)
- CI/CD pipeline (GitLab CI + ArgoCD)

### 5. Additional Roles
- Super Admin (full system access)
- Facility Manager (specific data center)
- Customer Admin (team management)
- Customer User (limited access)
- Billing Admin (finance only)

---

## 📊 Data

**Note**: This is a **visual prototype** with mock data:
- No backend connection
- No data persistence
- All data is hardcoded for demonstration
- Login accepts any credentials
- Role toggle works instantly (no API calls)

In production, all data will be:
- Fetched from REST/GraphQL APIs
- Scoped by tenant_id and user permissions
- Updated in real-time via WebSockets
- Secured with JWT authentication

---

## 💡 Key Features to Demonstrate

### Role-Based Access Control (RBAC)
- ✅ Different navigation menus by role
- ✅ Different dashboard layouts
- ✅ Data scoping (all vs personal)
- ✅ Feature visibility (Resources, Help)
- ✅ Visual role indicators (badges, colors)

### Admin Experience
- ✅ Information-dense dashboards
- ✅ Cross-customer analytics
- ✅ Facility-aware resource browsing
- ✅ System health monitoring
- ✅ Infrastructure management focus

### Customer Experience
- ✅ Simplified, workload-centric UI
- ✅ Self-service workload submission
- ✅ Clear budget visibility
- ✅ No infrastructure complexity
- ✅ Easy access to support

---

## 🐛 Troubleshooting

If you encounter issues:

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Clear and reinstall**: `rm -rf node_modules && npm install`
3. **Check browser console** for errors
4. **Try different port**: `npm run dev -- --port 3001`
5. **Clear browser cache** and reload
6. **Try incognito mode** to rule out extensions

---

## 📸 What You'll See

### Admin Portal
- 🎛️ Executive dashboard with platform-wide KPIs
- 🖥️ Resource browser showing all 10K+ GPUs
- 📊 Charts with total revenue and utilization
- 🚨 System alerts for critical incidents
- 🏢 Facility-level visibility (Texas-1, Texas-2, Canada-1)

### Customer Portal
- 📱 Clean, focused dashboard for personal metrics
- 💰 Budget progress bar and spending trends
- 📦 "Submit New Workload" CTA prominently displayed
- ❓ Help & Support center with FAQs
- 🎯 Simplified navigation (no infrastructure complexity)

### Role Switcher
- 🎭 Floating toggle in top-right corner
- ⚡ Instant role switching with no page reload
- 🎨 Visual feedback (colors, badges, menus change)
- 👤 Shows current user name and company

---

**Ready to visualize both portals?** Run `npm run dev` and toggle between roles! 🎉

Open http://localhost:3000 and start exploring! 🚀

---

## 🤝 Feedback

This prototype is designed for visualization and feedback. Please test:
- ✅ Both Admin and Customer flows
- ✅ Navigation and page transitions
- ✅ Interactive charts and tables
- ✅ Responsive design (resize browser)
- ✅ Role switching behavior
- ✅ Visual design and color scheme

Provide feedback on UX, layout, colors, or missing features before we move to full development!
