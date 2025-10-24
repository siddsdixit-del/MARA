# MARA HCP - UX/UI Design System & Specifications

**Version**: 1.0  
**Date**: October 2025  
**Purpose**: Complete design specifications for customer portal and internal tools

---

## 1. Design Philosophy

### Core Principles
- **Data-First**: Optimize for high-density information display
- **Real-Time**: Live updates with minimal latency
- **Professional**: Enterprise-grade aesthetic
- **Accessible**: WCAG 2.1 AA compliant
- **Dark-Optimized**: Reduce eye strain for extended monitoring

### Target Users
1. **Enterprise Customers**: Submit workloads, monitor usage, manage billing
2. **Operations Teams**: Monitor infrastructure, respond to alerts
3. **Executives**: Track revenue, utilization, business metrics
4. **Data Scientists**: Analyze performance, optimize algorithms

---

## 2. Visual Design System

### 2.1 Color Palette

#### Dark Theme (Primary)
```css
:root {
  /* Background Colors */
  --bg-primary: #0A0E27;           /* Main app background */
  --bg-secondary: #151933;          /* Card backgrounds */
  --bg-tertiary: #1E2139;          /* Hover states, dividers */
  --bg-elevated: #252946;          /* Modals, dropdowns */
  
  /* Accent Colors */
  --accent-blue: #3B82F6;          /* Primary actions, links */
  --accent-blue-hover: #2563EB;    /* Hover state */
  --accent-green: #10B981;         /* Success, profit */
  --accent-orange: #F59E0B;        /* Warnings, GPU */
  --accent-red: #EF4444;           /* Errors, critical */
  --accent-purple: #8B5CF6;        /* Bitcoin/ASIC */
  --accent-cyan: #06B6D4;          /* AI inference */
  
  /* Text Colors */
  --text-primary: #F9FAFB;         /* Primary text */
  --text-secondary: #9CA3AF;       /* Secondary text */
  --text-tertiary: #6B7280;        /* Tertiary text */
  --text-disabled: #4B5563;        /* Disabled state */
  
  /* Border & Divider */
  --border-primary: rgba(255, 255, 255, 0.1);
  --border-secondary: rgba(255, 255, 255, 0.05);
  
  /* Status Colors */
  --status-healthy: #10B981;
  --status-warning: #F59E0B;
  --status-critical: #EF4444;
  --status-offline: #6B7280;
}
```

#### Light Theme (Optional)
```css
:root[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --border-primary: rgba(0, 0, 0, 0.1);
}
```

### 2.2 Typography

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - Captions, labels */
--text-sm: 0.875rem;     /* 14px - Body small */
--text-base: 1rem;       /* 16px - Body */
--text-lg: 1.125rem;     /* 18px - Subheadings */
--text-xl: 1.25rem;      /* 20px - Section titles */
--text-2xl: 1.5rem;      /* 24px - Page titles */
--text-3xl: 1.875rem;    /* 30px - Hero */
--text-4xl: 2.25rem;     /* 36px - Large hero */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 2.3 Spacing System (8px base)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 2.4 Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Cards, buttons */
--radius-lg: 0.75rem;   /* 12px - Large cards */
--radius-xl: 1rem;      /* 16px - Modals */
--radius-full: 9999px;  /* Fully rounded */
```

### 2.5 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);

/* Glassmorphism */
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
--glass-bg: rgba(21, 25, 51, 0.8);
--glass-border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 3. Component Library

### 3.1 Buttons

#### Primary Button
```typescript
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      boxShadow: '0 6px 16px rgba(59, 130, 246, 0.6)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    }
  }}
>
  Submit Workload
</Button>
```

#### Secondary Button
```typescript
<Button
  variant="outlined"
  sx={{
    borderColor: 'var(--border-primary)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '12px 24px',
    '&:hover': {
      borderColor: 'var(--accent-blue)',
      background: 'rgba(59, 130, 246, 0.1)',
    }
  }}
>
  Cancel
</Button>
```

### 3.2 Cards

#### Glassmorphism Card
```typescript
<Card
  sx={{
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(10px)',
    border: 'var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--glass-shadow)',
  }}
>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### KPI Card
```typescript
<Card
  sx={{
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-primary)',
    padding: 'var(--space-6)',
    transition: 'all 0.3s ease',
    '&:hover': {
      border: '1px solid var(--accent-blue)',
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-lg)',
    }
  }}
>
  <Typography variant="h6" color="text.secondary">
    Total Revenue
  </Typography>
  <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mt: 2 }}>
    $127,432
  </Typography>
  <Chip
    label="↑ 12% vs yesterday"
    color="success"
    size="small"
    sx={{ mt: 2 }}
  />
</Card>
```

---

## 4. Screen Mockups

### 4.1 Executive Dashboard

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  MARA HCP                    🔍 Search (⌘K)            🔔 3    👤 John Doe  ☰  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Dashboard Overview                                      Last updated: 2s ago   │
│                                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌─────────────┐ │
│  │ TODAY'S REVENUE│  │  UTILIZATION   │  │   NET PROFIT   │  │   UPTIME    │ │
│  │                │  │                │  │                │  │             │ │
│  │   $127,432     │  │     94.2%      │  │    $89,124     │  │   99.99%    │ │
│  │   ↑ 12.3%      │  │     ↑ 2.1%     │  │    ↑ 8.5%      │  │   ✓ Healthy │ │
│  │                │  │                │  │                │  │             │ │
│  │ [Mini chart──] │  │ [Gauge chart]  │  │ [Mini chart──] │  │ [Status•••] │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └─────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ Revenue Trends (Last 7 Days)        │  │ Resource Allocation           │  │
│  │                                     │  │                               │  │
│  │  $140K ┤                       ●    │  │   🟦 45% GPU (AI Inference)   │  │
│  │        │                   ●   │    │  │   🟪 35% ASIC (BTC Mining)    │  │
│  │  $120K ┤               ●       │    │  │   ⚪ 20% Reserved/Idle         │  │
│  │        │           ●           │    │  │                               │  │
│  │  $100K ┤       ●               │    │  │   [Donut Chart Visual]        │  │
│  │        │   ●                   │    │  │                               │  │
│  │   $80K ┤●                      │    │  │   Total:                      │  │
│  │        └───────────────────────┘    │  │   • 10,000 GPUs               │  │
│  │         Mon   Wed   Fri   Sun       │  │   • 250,000 ASICs             │  │
│  └─────────────────────────────────────┘  └───────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Active Workloads                                   [+ Submit Workload] │   │
│  ├──────────┬─────────────┬──────────┬────────────┬──────────┬──────────┤   │
│  │ ID       │ Type        │ Status   │ Resources  │ Duration │ Cost/hr  │   │
│  ├──────────┼─────────────┼──────────┼────────────┼──────────┼──────────┤   │
│  │ wl-abc123│ AI Inf RT   │ ● Running│ 8x H100    │ 2h 34m   │ $42.50   │   │
│  │ wl-def456│ BTC Mining  │ ● Running│ 1K ASIC    │ 5h 12m   │ $18.20   │   │
│  │ wl-ghi789│ Model Train │ ● Running│ 16x H100   │ 12h 05m  │ $85.00   │   │
│  │ wl-jkl012│ AI Inf Batch│ ⏸ Paused │ 4x H100    │ 1h 45m   │ $21.25   │   │
│  │ wl-mno345│ AI Inf RT   │ ⏳ Queued │ --         │ --       │ --       │   │
│  └──────────┴─────────────┴──────────┴────────────┴──────────┴──────────┘   │
│                                                              Showing 1-5 of 247│
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Operations Dashboard

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Operations                                                      👤 Ops Team     │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Facility: Texas-1 [▼]          Status: ● Healthy          Alerts: ⚠️ 2 Warning│
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ GPU CLUSTER HEAT MAP (1,000 GPUs Real-time)             [Live] 1s ago   │  │
│  │                                                                          │  │
│  │  Rack 1    [🟢🟢🟢🟡🟡🟠🟠🔴🔴🟢]  95%  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  Rack 2    [🟢🟢🟢🟢🟡🟡🟠🟠🟢🟢]  87%  ━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │  Rack 3    [🟢🟢🟠🟠🟠🔴🔴🔴🔴🟠]  99%  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ⚠│  │
│  │  Rack 4    [🟢🟢🟢🟢🟢🟡🟡🟡🟢🟢]  65%  ━━━━━━━━━━━━━━━━━━━━━━━━━      │  │
│  │  Rack 5    [🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢]  35%  ━━━━━━━━━━━━━━━━━━━━━━         │  │
│  │                                                                          │  │
│  │  Legend:  🟢 0-50%   🟡 50-75%   🟠 75-90%   🔴 90-100%   ⚫ Offline    │  │
│  │                                                                          │  │
│  │  [Click any GPU for details]                                            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐│
│  │ SYSTEM METRICS (Last Hour)                                                ││
│  │                                                                            ││
│  │  Temperature (°C)          Power (kW)              Utilization (%)        ││
│  │  85 ┤                       400 ┤                   100 ┤                 ││
│  │     │      ╱──╲                │    ╱──╲                │      ╱──╲       ││
│  │  70 ┤    ╱      ╲            300 ┤  ╱      ╲            80 ┤    ╱      ╲  ││
│  │     │  ╱          ╲             │╱          ╲             │  ╱          ╲ ││
│  │  55 ┤─              ─         200 ┤            ─         60 ┤─            ││
│  │     └──────────────────          └──────────────────        └─────────────││
│  │     12:00  12:30  13:00          12:00  12:30  13:00        12:00  13:00 ││
│  └───────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
│  ┌──────────────────────────┐  ┌───────────────────────────────────────────┐ │
│  │ 🔔 Active Alerts (2)     │  │ 📊 Recent Events                          │ │
│  │                          │  │                                           │ │
│  │ ⚠️ GPU-1245              │  │ 13:24  ✓ Workload wl-abc123 completed    │ │
│  │    High temp: 82°C       │  │ 13:18  ⚠️ GPU-1245 temperature warning    │ │
│  │    2 min ago             │  │ 13:12  ℹ️ ASIC farm rebalanced            │ │
│  │    [View] [Dismiss]      │  │ 13:05  ✓ Workload wl-def456 started      │ │
│  │                          │  │ 12:58  ℹ️ Scheduled maintenance completed │ │
│  │ ⚠️ Rack 3 High Load      │  │                                           │ │
│  │    99% utilization       │  │ [View All Events →]                       │ │
│  │    5 min ago             │  │                                           │ │
│  │    [View] [Dismiss]      │  │                                           │ │
│  └──────────────────────────┘  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Figma Setup Guide

### Sprint 8 Deliverables

#### Step 1: Create Figma Workspace
1. Create new Figma file: `MARA HCP - Design System`
2. Set up pages:
   - 🎨 Design Tokens
   - 🧩 Components
   - 📱 Mobile Screens
   - 💻 Desktop Screens
   - 🔄 User Flows
   - 📝 Documentation

#### Step 2: Design Tokens
Create color styles, text styles, effects:
- All colors from palette
- Typography styles (H1-H6, body, caption)
- Shadow effects
- Border radius styles

#### Step 3: Component Library (50+ components)
**Navigation:**
- Top bar / header
- Sidebar navigation
- Breadcrumbs
- Tabs
- Command palette (⌘K)

**Data Display:**
- KPI cards
- Data tables
- Charts (line, bar, donut, heat map)
- Status badges
- Progress bars
- Metrics tiles

**Forms:**
- Text inputs
- Dropdowns
- Checkboxes
- Radio buttons
- Sliders
- Toggle switches
- Date pickers

**Feedback:**
- Toast notifications
- Alert banners
- Modals
- Loading spinners
- Empty states
- Error states

#### Step 4: Screen Designs (20+ screens)
1. Authentication
   - Login
   - Register
   - Forgot password
   - 2FA setup

2. Dashboard Views
   - Executive dashboard
   - Operations dashboard
   - Customer dashboard

3. Workload Management
   - Submit workload form
   - Workload list
   - Workload detail
   - Workload logs

4. Resource Management
   - Resource browser
   - GPU detail view
   - ASIC detail view
   - Heat map view

5. Billing & Usage
   - Usage dashboard
   - Billing history
   - Cost breakdown
   - Invoice details

6. Settings
   - Profile settings
   - Team management
   - API keys
   - Notifications

7. Mobile Views
   - Mobile dashboard
   - Mobile navigation
   - Mobile forms

#### Step 5: Interactive Prototype
- Create clickable prototype
- Add micro-interactions
- Define transitions
- User flow demonstrations

#### Step 6: Design Token Export
Export design tokens as JSON for development:
```json
{
  "color": {
    "primary": { "value": "#3B82F6" },
    "background": { 
      "primary": { "value": "#0A0E27" },
      "secondary": { "value": "#151933" }
    }
  },
  "typography": {
    "fontSize": {
      "base": { "value": "16px" },
      "lg": { "value": "18px" }
    }
  }
}
```

---

## 6. Implementation Guide

### Material-UI Theme Setup

```typescript
// theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      dark: '#2563EB',
      light: '#60A5FA',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: '#0A0E27',
      paper: '#151933',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(59, 130, 246, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
```

### Example Component Usage

```typescript
// KPICard.tsx
import { Card, CardContent, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export const KPICard = ({ title, value, change, trend }: KPICardProps) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(21,25,51,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid #3B82F6',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, my: 2 }}>
          {value}
        </Typography>
        <Chip
          icon={<TrendingUpIcon />}
          label={change}
          size="small"
          color={trend === 'up' ? 'success' : 'error'}
        />
      </CardContent>
    </Card>
  );
};
```

---

### 4.3 Login Page

```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    ┌─────────────────┐                     │
│                    │   MARA HCP      │                     │
│                    │   [Logo]        │                     │
│                    └─────────────────┘                     │
│                                                             │
│              Hybrid Compute Platform                        │
│                                                             │
│                                                             │
│         ┌───────────────────────────────────────┐          │
│         │  Email                                │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │ john@company.com                │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  Password                             │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │ ••••••••••••                    │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  [ ] Remember me    Forgot password? │          │
│         │                                       │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │      Sign In    →               │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │         ─── or ───                    │          │
│         │                                       │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │  🔐 Sign in with SSO            │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  Don't have an account? Sign up      │          │
│         └───────────────────────────────────────┘          │
│                                                             │
│                                                             │
│         © 2025 MARA Holdings. All rights reserved.         │
└────────────────────────────────────────────────────────────┘
```

### 4.4 Register Page

```
┌────────────────────────────────────────────────────────────┐
│                    [MARA HCP Logo]                          │
│                                                             │
│              Create Your Account                            │
│                                                             │
│         ┌───────────────────────────────────────┐          │
│         │  Company Name *                       │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │ Acme Corporation                │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  Work Email *                         │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │ john@acme.com                   │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  Full Name *                          │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │ John Doe                        │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  Password *                           │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │ ••••••••••••                    │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │  ✓ At least 8 characters              │          │
│         │  ✓ One uppercase letter               │          │
│         │  ✓ One number                         │          │
│         │  ○ One special character              │          │
│         │                                       │          │
│         │  [ ] I agree to Terms & Privacy Policy│          │
│         │                                       │          │
│         │  ┌─────────────────────────────────┐ │          │
│         │  │      Create Account    →        │ │          │
│         │  └─────────────────────────────────┘ │          │
│         │                                       │          │
│         │  Already have an account? Sign in     │          │
│         └───────────────────────────────────────┘          │
└────────────────────────────────────────────────────────────┘
```

### 4.5 Resource Browser

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Resources                                                [+ Add Resource]      │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search resources...                                                   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ All (10,247) │  │ GPUs (10,000)│  │ ASICs (250K) │  │ Storage (247)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                                                 │
│  Filters:  Facility [All ▼]  Status [All ▼]  Type [All ▼]     [Clear Filters]│
│                                                                                 │
│  ┌────┬──────────┬────────────┬──────────┬──────────────┬──────────┬────────┐│
│  │    │ ID       │ Type       │ Status   │ Utilization  │ Workload │ Actions││
│  ├────┼──────────┼────────────┼──────────┼──────────────┼──────────┼────────┤│
│  │ 🖥️ │ GPU-1234 │ H100 80GB  │ ● Active │ ████████░░87%│ wl-abc123│ [•••]  ││
│  │    │ Texas-1  │ Rack 2-15  │          │ 72°C  650W   │          │        ││
│  │    │          │            │          │              │          │        ││
│  │ 🖥️ │ GPU-1235 │ H100 80GB  │ ● Active │ ██████████99%│ wl-def456│ [•••]  ││
│  │    │ Texas-1  │ Rack 2-16  │          │ 78°C  680W⚠️ │          │        ││
│  │    │          │            │          │              │          │        ││
│  │ 🖥️ │ GPU-1236 │ H100 80GB  │ ○ Idle   │ ░░░░░░░░░░ 0%│ --       │ [•••]  ││
│  │    │ Texas-1  │ Rack 2-17  │          │ 45°C   80W   │          │        ││
│  │    │          │            │          │              │          │        ││
│  │ ⚙️ │ ASIC-5678│ S21 XP     │ ● Mining │ ██████████99%│ btc-pool │ [•••]  ││
│  │    │ Texas-2  │ Container-3│          │ 270 TH/s     │          │        ││
│  │    │          │            │          │              │          │        ││
│  │ 🖥️ │ GPU-1237 │ L40S 48GB  │ ⚠️ Warning│████████░░85%│ wl-ghi789│ [•••]  ││
│  │    │ Texas-1  │ Rack 3-04  │          │ 83°C  550W   │          │        ││
│  │    │          │            │          │              │          │        ││
│  │ 🖥️ │ GPU-1238 │ H100 80GB  │🔧 Maint. │ ░░░░░░░░░░ 0%│ --       │ [•••]  ││
│  │    │ Texas-1  │ Rack 1-08  │          │ -- °C  -- W  │          │        ││
│  └────┴──────────┴────────────┴──────────┴──────────────┴──────────┴────────┘│
│                                                          Showing 1-7 of 10,247 │
│                                                      [<] [1] [2] [3] ... [>]   │
│                                                                                 │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                    │
│  │ Total Capacity │ │ In Use         │ │ Available      │                    │
│  │ 10,000 GPUs    │ │ 8,750 (87.5%)  │ │ 1,250 (12.5%)  │                    │
│  └────────────────┘ └────────────────┘ └────────────────┘                    │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 Resource Detail View

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ← Resources    GPU-1234                                      ● Healthy        │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  NVIDIA H100 80GB                            Rack 2, Position 15        │  │
│  │  Serial: NK42-8F3D-9A2E-1B7C                Facility: Texas-1           │  │
│  │  Purchased: Jan 2025                        Warranty: 3 years           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐│
│  │ UTILIZATION     │ │ TEMPERATURE     │ │ POWER DRAW      │ │ MEMORY       ││
│  │                 │ │                 │ │                 │ │              ││
│  │     87%         │ │      72°C       │ │     650W        │ │  64/80 GB    ││
│  │  [████████░░]   │ │  [███████░░░]   │ │  [████████░]    │ │  [████████░] ││
│  │                 │ │                 │ │                 │ │              ││
│  │  Normal range   │ │  Normal range   │ │  Normal range   │ │  80% used    ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ └──────────────┘│
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ REAL-TIME METRICS (Last 5 Minutes)                    [5m▼] [Refresh]   │  │
│  │                                                                          │  │
│  │  100% ┤                                                                 │  │
│  │       │                    ╱──╲                                         │  │
│  │   75% ┤      ╱──╲      ╱──      ──╲        [Utilization]               │  │
│  │       │    ╱      ╲  ╱              ╲      [Temperature]                │  │
│  │   50% ┤  ╱          ──                ──╲  [Power]                      │  │
│  │       │╱                                  ╲                              │  │
│  │   25% ┤                                    ──╲                          │  │
│  │       └──────────────────────────────────────────                       │  │
│  │       13:00    13:01    13:02    13:03    13:04                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ CURRENT WORKLOAD                     │  │ HEALTH STATUS                │  │
│  │                                      │  │                              │  │
│  │ ID: wl-abc123                       │  │ Overall:    ✓ Healthy        │  │
│  │ Type: AI Inference (Real-time)      │  │ Hardware:   ✓ No errors      │  │
│  │ Customer: Acme Corp                 │  │ Thermal:    ✓ Normal range   │  │
│  │ Started: 2h 34m ago                 │  │ Power:      ✓ Within limits  │  │
│  │ Priority: 3/10 (Normal)             │  │ Memory:     ✓ Normal         │  │
│  │                                      │  │ Network:    ✓ Connected      │  │
│  │ Estimated completion: 3h 15m        │  │                              │  │
│  │ Cost so far: $109.25                │  │ Last check: 5 seconds ago    │  │
│  │                                      │  │ Uptime: 99.98% (30 days)     │  │
│  │ [View Workload Details →]           │  │                              │  │
│  └──────────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ PERFORMANCE HISTORY (24 Hours)                                          │  │
│  │                                                                          │  │
│  │  Avg Utilization: 85%    Peak: 99%    Min: 12%                         │  │
│  │  Avg Temperature: 70°C   Peak: 78°C   Min: 45°C                        │  │
│  │  Total Runtime: 22.5h    Idle Time: 1.5h                               │  │
│  │  Revenue Generated: $2,025.50                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ RECENT EVENTS                                                            │  │
│  │                                                                          │  │
│  │  13:24  ℹ️  Utilization increased to 87%                                 │  │
│  │  12:45  ✓  Workload wl-xyz999 completed successfully                    │  │
│  │  11:30  ℹ️  New workload wl-abc123 started                               │  │
│  │  11:29  ✓  Health check passed                                          │  │
│  │  10:15  ℹ️  Utilization decreased to 45%                                 │  │
│  │  09:30  ⚠️  Temperature reached 76°C (threshold warning)                 │  │
│  │  09:28  ℹ️  Temperature normalized to 72°C                               │  │
│  │                                                                          │  │
│  │  [View All Events →]                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ACTIONS                                                                  │  │
│  │                                                                          │  │
│  │  [🔄 Switch Workload]  [⏸️ Pause]  [🔧 Maintenance]  [📊 Full Report]  │  │
│  │  [⚙️ Configure]  [🔔 Set Alerts]  [📥 Export Logs]                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.7 Workload List View

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Workloads                                                [+ Submit Workload]   │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search workloads by ID, type, or customer...                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │ All (247)    │ │ Running (142)│ │ Queued (18)  │ │ Completed (87)│         │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                                                 │
│  Filters:  Type [All ▼]  Priority [All ▼]  Customer [All ▼]  [Clear Filters]  │
│                                                                                 │
│  ┌──────────┬─────────────┬─────────┬──────────┬─────────┬──────────┬────────┐│
│  │ ID       │ Type        │ Status  │ Resources│ Runtime │ Cost     │ Actions││
│  ├──────────┼─────────────┼─────────┼──────────┼─────────┼──────────┼────────┤│
│  │ wl-abc123│ AI Inf RT   │● Running│ 8x H100  │ 2h 34m  │ $109.25  │ [•••]  ││
│  │ Acme Corp│ Priority: 3 │         │ Texas-1  │ Est: 3h │ +$42.50/h│        ││
│  │          │             │         │          │         │          │        ││
│  │ wl-def456│ BTC Mining  │● Running│ 1K ASIC  │ 5h 12m  │ $94.80   │ [•••]  ││
│  │ Internal │ Priority: 3 │         │ Texas-2  │ Ongoing │ +$18.20/h│        ││
│  │          │             │         │          │         │          │        ││
│  │ wl-ghi789│ Model Train │● Running│ 16x H100 │ 12h 05m │ $1,025.00│ [•••]  ││
│  │ TechCo   │ Priority: 2 │         │ Texas-1  │ Est: 48h│ +$85.00/h│        ││
│  │          │             │         │          │         │          │        ││
│  │ wl-jkl012│ AI Inf Batch│⏸ Paused │ 4x H100  │ 1h 45m  │ $37.19   │ [•••]  ││
│  │ DataCorp │ Priority: 2 │         │ Texas-1  │ Paused  │ $0.00/h  │        ││
│  │          │             │         │          │         │          │        ││
│  │ wl-mno345│ AI Inf RT   │⏳ Queued │ --       │ --      │ $0.00    │ [•••]  ││
│  │ Acme Corp│ Priority: 3 │         │ Pending  │ <2 min  │ Est $42/h│        ││
│  │          │             │         │          │         │          │        ││
│  │ wl-pqr678│ Model Train │✓ Complete│16x H100 │ 24h 00m │ $2,040.00│ [•••]  ││
│  │ AI Labs  │ Priority: 2 │         │ Texas-1  │ Finished│ Final    │        ││
│  │          │             │         │          │         │          │        ││
│  │ wl-stu901│ AI Inf RT   │❌ Failed │ 8x H100  │ 0h 12m  │ $8.50    │ [•••]  ││
│  │ TestCo   │ Priority: 3 │         │ Texas-1  │ Error   │ Final    │        ││
│  └──────────┴─────────────┴─────────┴──────────┴─────────┴──────────┴────────┘│
│                                                            Showing 1-7 of 247   │
│                                                        [<] [1] [2] [3] ... [>]  │
│                                                                                 │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌─────────────────────┐   │
│  │ Total Active         │ │ Est. Cost/Hour       │ │ Total Cost (Today)  │   │
│  │ 142 workloads        │ │ $1,847.50            │ │ $32,450.75          │   │
│  └──────────────────────┘ └──────────────────────┘ └─────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.8 Workload Detail View

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ← Workloads    wl-abc123                                   ● Running          │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  AI Inference (Real-time) • GPT-4 70B                                   │  │
│  │  Customer: Acme Corp                              Started: 2h 34m ago   │  │
│  │  Priority: 3/10 (Normal)                          Est. Complete: 3h 15m │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────┐  │
│  │ RESOURCES     │ │ RUNTIME       │ │ COST          │ │ REQUESTS         │  │
│  │               │ │               │ │               │ │                  │  │
│  │  8x H100      │ │  2h 34m       │ │  $109.25      │ │  12,450          │  │
│  │  640 GB RAM   │ │  Est: 5h 49m  │ │  +$42.50/hr   │ │  81.2 req/sec    │  │
│  │  Texas-1      │ │               │ │               │ │                  │  │
│  └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ PERFORMANCE METRICS                                      [Live] 1s ago   │  │
│  │                                                                          │  │
│  │  GPU Utilization                    Throughput                          │  │
│  │  100% ┤                             100 req/s┤                          │  │
│  │       │      ╱──╲                          │    ╱──╲                    │  │
│  │   75% ┤    ╱      ╲                   75   ┤  ╱      ╲                 │  │
│  │       │  ╱          ╲                      │╱          ╲                │  │
│  │   50% ┤─              ─                50  ┤            ─               │  │
│  │       └─────────────────               └────────────────                │  │
│  │       13:00   13:02  13:04            13:00   13:02  13:04             │  │
│  │                                                                          │  │
│  │  Avg: 87%   Peak: 99%   Min: 72%     Avg: 81.2   Peak: 94.5   Min: 68  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ CONFIGURATION                        │  │ SLA COMPLIANCE               │  │
│  │                                      │  │                              │  │
│  │ Model: GPT-4 (70B)                  │  │ Uptime:      ✓ 100%         │  │
│  │ Batch Size: 32                      │  │ Latency:     ✓ 45ms (p50)   │  │
│  │ Max Latency: 100ms                  │  │ Throughput:  ✓ 81.2 req/s   │  │
│  │ Auto-scaling: Enabled               │  │ Errors:      ✓ 0.02%        │  │
│  │ Checkpoint: Every 15 min            │  │                              │  │
│  │ Timeout: 6 hours                    │  │ SLA Target: 99.9%            │  │
│  │ Max Cost: $500.00                   │  │ Current: 100% ✓              │  │
│  │                                      │  │                              │  │
│  │ [Edit Configuration]                 │  │ [View SLA Details →]         │  │
│  └──────────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ALLOCATED RESOURCES                                                      │  │
│  │                                                                          │  │
│  │  GPU-1234  Texas-1 R2-15  ████████░░ 87%  72°C  650W  ✓ Healthy        │  │
│  │  GPU-1235  Texas-1 R2-16  ██████████ 99%  78°C  680W  ⚠️ High util      │  │
│  │  GPU-1236  Texas-1 R2-17  ███████░░░ 85%  70°C  640W  ✓ Healthy        │  │
│  │  GPU-1237  Texas-1 R2-18  ████████░░ 89%  73°C  655W  ✓ Healthy        │  │
│  │  GPU-1238  Texas-1 R2-19  ███████░░░ 83%  69°C  635W  ✓ Healthy        │  │
│  │  GPU-1239  Texas-1 R2-20  ████████░░ 88%  74°C  660W  ✓ Healthy        │  │
│  │  GPU-1240  Texas-1 R2-21  ██████░░░░ 78%  67°C  620W  ✓ Healthy        │  │
│  │  GPU-1241  Texas-1 R2-22  █████████░ 91%  75°C  670W  ✓ Healthy        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ LOGS & EVENTS                                            [Filter ▼]      │  │
│  │                                                                          │  │
│  │  13:24:15  INFO   Processed 1,000 requests                              │  │
│  │  13:24:10  INFO   GPU-1235 utilization reached 99%                      │  │
│  │  13:24:05  INFO   Checkpoint saved: checkpoint-152                      │  │
│  │  13:23:50  WARN   Latency spike detected: 95ms                          │  │
│  │  13:23:40  INFO   Auto-scaled: added 2 GPUs                             │  │
│  │  13:23:30  INFO   Throughput: 85 req/s                                  │  │
│  │  13:23:15  INFO   Processed 1,000 requests                              │  │
│  │  13:23:00  INFO   All GPUs healthy                                      │  │
│  │                                                                          │  │
│  │  [View Full Logs →]  [Download Logs]                                    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ACTIONS                                                                  │  │
│  │                                                                          │  │
│  │  [⏸️ Pause]  [⏹️ Stop]  [🔄 Restart]  [⚙️ Configure]  [📊 Full Report]  │  │
│  │  [📥 Export Data]  [🔔 Set Alerts]  [💾 Create Checkpoint]              │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.9 Billing Dashboard (Complete)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Billing & Usage                                      [Download Invoice PDF]   │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Billing Period: October 1-31, 2025               Payment Due: November 5, 2025│
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  CURRENT MONTH SUMMARY                                                  │  │
│  │                                                                          │  │
│  │  Total Usage to Date:        $87,432.18                                │  │
│  │  Projected Month Total:      $124,567.00                               │  │
│  │  Budget:                     $150,000.00  (83% used)                   │  │
│  │  ████████████████████████████████████████░░░░░░░░                       │  │
│  │                                                                          │  │
│  │  Days Remaining: 8           Avg Daily Cost: $2,872.49                 │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ DAILY USAGE BREAKDOWN                                [View by Hour ▼]   │  │
│  │                                                                          │  │
│  │  $6K ┤                                                              ●   │  │
│  │      │                                                          ●       │  │
│  │  $5K ┤                                                      ●           │  │
│  │      │                                                  ●               │  │
│  │  $4K ┤                                              ●                   │  │
│  │      │                                          ●                       │  │
│  │  $3K ┤                                      ●                           │  │
│  │      │                                  ●                               │  │
│  │  $2K ┤                              ●                                   │  │
│  │      └───────────────────────────────────────────────────────────────  │  │
│  │       Oct 1    Oct 8    Oct 15    Oct 22    Oct 29                     │  │
│  │                                                                          │  │
│  │  Peak Day: Oct 28 ($5,890.25)    Lowest Day: Oct 3 ($2,145.80)        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ COST BY RESOURCE TYPE                                                   │  │
│  ├──────────────────┬──────────────┬─────────────┬──────────────┬─────────┤  │
│  │ Resource Type    │ Usage Hours  │ Rate        │ Total Cost   │ % Total │  │
│  ├──────────────────┼──────────────┼─────────────┼──────────────┼─────────┤  │
│  │ GPU (H100)       │ 12,456 hrs   │ $2.50/hr    │ $31,140.00   │  35.6%  │  │
│  │ GPU (L40S)       │ 8,234 hrs    │ $1.80/hr    │ $14,821.20   │  17.0%  │  │
│  │ ASIC Mining      │ 45,280 hrs   │ $0.18/hr    │ $8,150.40    │   9.3%  │  │
│  │ Storage          │ 15,000 GB    │ $0.10/GB    │ $1,500.00    │   1.7%  │  │
│  │ Network Transfer │ 234 TB       │ $0.05/GB    │ $11,970.00   │  13.7%  │  │
│  │ Data Egress      │ 89 TB        │ $0.12/GB    │ $10,680.00   │  12.2%  │  │
│  │ Support          │ --           │ $500/month  │ $500.00      │   0.6%  │  │
│  │ Other            │ --           │ --          │ $8,670.58    │   9.9%  │  │
│  ├──────────────────┴──────────────┴─────────────┼──────────────┼─────────┤  │
│  │                                       TOTAL:   │ $87,432.18   │  100%   │  │
│  └────────────────────────────────────────────────┴──────────────┴─────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ TOP WORKLOADS BY COST                                                   │  │
│  │                                                                          │  │
│  │  1. wl-abc123  AI Inference RT      [████████████████████] $12,450.00  │  │
│  │  2. wl-def456  Model Training       [███████████████     ] $8,920.00   │  │
│  │  3. wl-ghi789  BTC Mining           [█████████          ] $6,340.00    │  │
│  │  4. wl-jkl012  AI Inference Batch   [███████            ] $4,180.00    │  │
│  │  5. wl-mno345  Model Training       [█████              ] $3,245.00    │  │
│  │  6. wl-pqr678  AI Inference RT      [████               ] $2,890.00    │  │
│  │  7. wl-stu901  Data Processing      [███                ] $2,120.00    │  │
│  │                                                                          │  │
│  │  Other workloads (240):                                  $47,287.18     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ COST BY FACILITY                                                        │  │
│  │                                                                          │  │
│  │  Texas-1    [████████████████████████] $52,459.31  (60%)               │  │
│  │  Texas-2    [████████████] $26,193.06  (30%)                           │  │
│  │  Canada-1   [████] $8,779.81  (10%)                                    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ BILLING ALERTS & NOTIFICATIONS                                          │  │
│  │                                                                          │  │
│  │  ✓ Budget on track (83% used with 8 days remaining)                    │  │
│  │  ℹ️  GPU usage increased 15% vs last week                               │  │
│  │  ⚠️  Projected to exceed budget if current trend continues               │  │
│  │                                                                          │  │
│  │  [Configure Budget Alerts →]                                            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ACTIONS                                                                  │  │
│  │                                                                          │  │
│  │  [📥 Download Detailed Report]  [📊 Export to CSV]  [📧 Email Invoice]  │  │
│  │  [⚙️ Configure Budget]  [🔔 Set Cost Alerts]  [💳 Payment Methods]     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.10 Settings - Profile

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Settings                                                                       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐  ┌──────────────────────────────────────────────────────┐   │
│  │              │  │                                                       │   │
│  │  Profile     │  │  PROFILE INFORMATION                                 │   │
│  │              │  │                                                       │   │
│  │  Team        │  │  ┌──────────┐                                        │   │
│  │              │  │  │          │  John Doe                              │   │
│  │  API Keys    │  │  │  [Photo] │  john@acme.com                         │   │
│  │              │  │  │          │  Admin                                 │   │
│  │  Billing     │  │  └──────────┘  [Change Photo]                       │   │
│  │              │  │                                                       │   │
│  │  Security    │  │  Name                                                │   │
│  │              │  │  ┌─────────────────────────────────────────────────┐│   │
│  │  Notifications│ │  │ John Doe                                        ││   │
│  │              │  │  └─────────────────────────────────────────────────┘│   │
│  │  Preferences │  │                                                       │   │
│  │              │  │  Email                                                │   │
│  │  Integrations│  │  ┌─────────────────────────────────────────────────┐│   │
│  │              │  │  │ john@acme.com                                   ││   │
│  └──────────────┘  │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  Company                                              │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ Acme Corporation                                ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  Role                                                 │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ Administrator                                ▼  ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  Time Zone                                            │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ (UTC-05:00) Eastern Time                     ▼  ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  Language                                             │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ English (US)                                 ▼  ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  ┌─────────────┐  ┌──────────────────┐              │   │
│                     │  │   Cancel    │  │  Save Changes →  │              │   │
│                     │  └─────────────┘  └──────────────────┘              │   │
│                     │                                                       │   │
│                     │  ─────────────────────────────────────────────────  │   │
│                     │                                                       │   │
│                     │  CHANGE PASSWORD                                      │   │
│                     │                                                       │   │
│                     │  Current Password                                     │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ ••••••••••••                                    ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  New Password                                         │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ ••••••••••••                                    ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  Confirm New Password                                 │   │
│                     │  ┌─────────────────────────────────────────────────┐│   │
│                     │  │ ••••••••••••                                    ││   │
│                     │  └─────────────────────────────────────────────────┘│   │
│                     │                                                       │   │
│                     │  [Update Password]                                    │   │
│                     │                                                       │   │
│                     │  ─────────────────────────────────────────────────  │   │
│                     │                                                       │   │
│                     │  DANGER ZONE                                          │   │
│                     │                                                       │   │
│                     │  [Delete Account]  Warning: This cannot be undone    │   │
│                     └───────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.11 Settings - API Keys

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Settings > API Keys                                                            │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │  API KEYS                                        [+ Create New API Key] │   │
│  │                                                                         │   │
│  │  Use API keys to access MARA HCP programmatically. Keep your keys      │   │
│  │  secure and never share them publicly.                                  │   │
│  │                                                                         │   │
│  │  📖 [View API Documentation →]                                          │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ Production Keys                                                         │   │
│  ├──────────────────┬──────────────┬─────────────┬────────────┬──────────┤   │
│  │ Name             │ Key Preview  │ Last Used   │ Created    │ Actions  │   │
│  ├──────────────────┼──────────────┼─────────────┼────────────┼──────────┤   │
│  │ Production API   │ mk_prod_x... │ 2 hours ago │ Jan 15 2025│ [•••]    │   │
│  │ Scopes: full     │              │             │            │          │   │
│  │                  │              │             │            │          │   │
│  │ CI/CD Pipeline   │ mk_prod_y... │ 1 day ago   │ Dec 1 2024 │ [•••]    │   │
│  │ Scopes: submit   │              │             │            │          │   │
│  └──────────────────┴──────────────┴─────────────┴────────────┴──────────┘   │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ Development Keys                                                        │   │
│  ├──────────────────┬──────────────┬─────────────┬────────────┬──────────┤   │
│  │ Name             │ Key Preview  │ Last Used   │ Created    │ Actions  │   │
│  ├──────────────────┼──────────────┼─────────────┼────────────┼──────────┤   │
│  │ Local Dev        │ mk_dev_a...  │ Just now    │ Oct 20 2025│ [•••]    │   │
│  │ Scopes: read     │              │             │            │          │   │
│  │                  │              │             │            │          │   │
│  │ Testing          │ mk_dev_b...  │ Never       │ Oct 15 2025│ [•••]    │   │
│  │ Scopes: read     │              │             │            │          │   │
│  └──────────────────┴──────────────┴─────────────┴────────────┴──────────┘   │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ API USAGE (Last 30 Days)                                               │   │
│  │                                                                         │   │
│  │  Total Requests: 1,245,890                                             │   │
│  │  Success Rate: 99.98%                                                  │   │
│  │  Avg Response Time: 45ms                                               │   │
│  │                                                                         │   │
│  │  10K ┤                                                              ●  │   │
│  │      │                                                          ●      │   │
│  │   8K ┤                                                      ●          │   │
│  │      │                                                  ●              │   │
│  │   6K ┤                                              ●                  │   │
│  │      │                                          ●                      │   │
│  │   4K ┤                                      ●                          │   │
│  │      └──────────────────────────────────────────────────────────────  │   │
│  │       Oct 1        Oct 8        Oct 15       Oct 22       Oct 29      │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │ WEBHOOKS                                          [+ Add Webhook]      │   │
│  │                                                                         │   │
│  │  https://api.acme.com/webhooks/mara                                   │   │
│  │  Events: workload.*, resource.status                                   │   │
│  │  Last triggered: 5 minutes ago ✓                                       │   │
│  │  [Edit] [Test] [Delete]                                                │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.12 Mobile Dashboard View

```
┌────────────────────────┐
│  ☰  MARA HCP      🔔 3 │
├────────────────────────┤
│                        │
│  Dashboard             │
│                        │
│  ┌────────────────────┐│
│  │ TODAY'S REVENUE    ││
│  │                    ││
│  │   $127,432         ││
│  │   ↑ 12.3%          ││
│  │                    ││
│  │ [Mini chart ───]   ││
│  └────────────────────┘│
│                        │
│  ┌────────────────────┐│
│  │ UTILIZATION        ││
│  │                    ││
│  │     94.2%          ││
│  │   ━━━━━━━━━━━━━━━ ││
│  │                    ││
│  └────────────────────┘│
│                        │
│  ┌────────────────────┐│
│  │ ACTIVE WORKLOADS   ││
│  │                    ││
│  │     142            ││
│  │   [View All →]     ││
│  │                    ││
│  └────────────────────┘│
│                        │
│  ┌────────────────────┐│
│  │ ALERTS             ││
│  │                    ││
│  │ ⚠️ 2 warnings      ││
│  │ [View Details →]   ││
│  │                    ││
│  └────────────────────┘│
│                        │
│  Recent Workloads      │
│                        │
│  ┌────────────────────┐│
│  │ wl-abc123          ││
│  │ AI Inference RT    ││
│  │ ● Running • 2h 34m ││
│  │ $109.25            ││
│  └────────────────────┘│
│                        │
│  ┌────────────────────┐│
│  │ wl-def456          ││
│  │ BTC Mining         ││
│  │ ● Running • 5h 12m ││
│  │ $94.80             ││
│  └────────────────────┘│
│                        │
│  [View All →]          │
│                        │
│  ┌────────────────────┐│
│  │ + Submit Workload  ││
│  └────────────────────┘│
│                        │
├────────────────────────┤
│ 🏠  📊  ⚙️  💰  👤   │
└────────────────────────┘
```

### 4.13 Alert Management Interface

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  Alerts & Notifications                                [Configure Rules]       │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │ All (247)    │ │ Critical (3) │ │ Warning (12) │ │ Info (232)   │         │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                                                 │
│  Filters:  Type [All ▼]  Resource [All ▼]  Status [Unread ▼]  [Clear]         │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔴 CRITICAL                                                 5 min ago    │  │
│  │                                                                          │  │
│  │ GPU-1245 Temperature Critical                                           │  │
│  │ GPU-1245 temperature reached 85°C, exceeding critical threshold.        │  │
│  │ Automatic remediation triggered: Workload migrated to GPU-1250          │  │
│  │                                                                          │  │
│  │ Resource: GPU-1245 • Facility: Texas-1 • Rack: 3                       │  │
│  │                                                                          │  │
│  │ [View Resource →]  [Acknowledge]  [Create Incident]  [Dismiss]          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔴 CRITICAL                                                 15 min ago   │  │
│  │                                                                          │  │
│  │ Workload wl-stu901 Failed                                               │  │
│  │ Workload wl-stu901 failed after 12 minutes due to GPU memory error.    │  │
│  │ Error: CUDA out of memory. Consider reducing batch size.                │  │
│  │                                                                          │  │
│  │ Workload: wl-stu901 • Customer: TestCo                                  │  │
│  │                                                                          │  │
│  │ [View Workload →]  [View Logs]  [Restart]  [Dismiss]                   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🟠 WARNING                                                  2 hours ago  │  │
│  │                                                                          │  │
│  │ Rack 3 High Utilization                                                 │  │
│  │ Rack 3 utilization at 99% for 10+ minutes. Consider load balancing.    │  │
│  │ Current utilization: 99% (8/8 GPUs at >95%)                             │  │
│  │                                                                          │  │
│  │ Facility: Texas-1 • Rack: 3                                             │  │
│  │                                                                          │  │
│  │ [View Rack →]  [Rebalance Load]  [Acknowledge]  [Dismiss]              │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🟠 WARNING                                                  3 hours ago  │  │
│  │                                                                          │  │
│  │ Cost Budget Alert                                                       │  │
│  │ Current month spending is 83% of budget with 8 days remaining.         │  │
│  │ Projected overage: $4,567 if current trend continues.                  │  │
│  │                                                                          │  │
│  │ Budget: $150,000 • Spent: $124,567 • Remaining: $25,433                │  │
│  │                                                                          │  │
│  │ [View Billing →]  [Adjust Budget]  [Optimize Costs]  [Dismiss]         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔵 INFO                                                     5 hours ago  │  │
│  │                                                                          │  │
│  │ Workload wl-abc123 Completed                                            │  │
│  │ Workload wl-abc123 completed successfully after 24 hours.               │  │
│  │ Total cost: $2,040.00 • Processed: 2.4M requests                        │  │
│  │                                                                          │  │
│  │ [View Report →]  [Dismiss]                                              │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌────────────────────────┐                                                    │
│  │ ALERT RULES            │                                                    │
│  │                        │                                                    │
│  │ ✓ GPU Temperature      │                                                    │
│  │ ✓ High Utilization     │                                                    │
│  │ ✓ Workload Failures    │                                                    │
│  │ ✓ Cost Thresholds      │                                                    │
│  │ ✓ SLA Violations       │                                                    │
│  │                        │                                                    │
│  │ [Configure Rules →]    │                                                    │
│  └────────────────────────┘                                                    │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Interactive Patterns & Animations

### 5.1 Loading States

```typescript
// Skeleton Loading
<Box sx={{ p: 3 }}>
  <Skeleton variant="text" width="40%" height={40} />
  <Skeleton variant="rectangular" width="100%" height={200} sx={{ my: 2 }} />
  <Skeleton variant="text" width="60%" />
  <Skeleton variant="text" width="80%" />
</Box>

// Progress Bar Loading
<LinearProgress 
  variant="determinate" 
  value={progress}
  sx={{
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    '& .MuiLinearProgress-bar': {
      background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
    }
  }}
/>

// Spinner Loading
<CircularProgress 
  size={40}
  sx={{
    color: '#3B82F6',
  }}
/>
```

### 5.2 Toast Notifications

```typescript
// Success Toast
<Snackbar
  open={open}
  autoHideDuration={4000}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert 
    severity="success"
    icon={<CheckCircleIcon />}
    sx={{
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: 'white',
    }}
  >
    <AlertTitle>Workload Submitted</AlertTitle>
    wl-abc123 is now queued and will start in ~2 minutes
  </Alert>
</Snackbar>

// Error Toast
<Alert severity="error">
  <AlertTitle>Submission Failed</AlertTitle>
  Insufficient GPU capacity. Try again later.
</Alert>

// Warning Toast  
<Alert severity="warning">
  <AlertTitle>High Temperature Detected</AlertTitle>
  GPU-1245 at 82°C. Monitoring...
</Alert>
```

### 5.3 Micro-interactions

```typescript
// Button Press Animation
sx={{
  transition: 'all 0.1s ease',
  '&:active': {
    transform: 'scale(0.98)',
  }
}}

// Card Hover Effect
sx={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
  }
}}

// Success Checkmark Animation
<CheckCircleIcon 
  sx={{
    '@keyframes checkmark': {
      '0%': { opacity: 0, transform: 'scale(0.5)' },
      '50%': { transform: 'scale(1.2)' },
      '100%': { opacity: 1, transform: 'scale(1)' },
    },
    animation: 'checkmark 0.4s ease-in-out',
  }}
/>
```

---

This design system document will be referenced throughout Sprint 8-9 implementation. All components should follow these specifications for consistency.

