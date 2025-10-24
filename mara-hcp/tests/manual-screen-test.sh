#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════╗
# ║         MARA HCP - MANUAL FRONTEND SCREEN TEST GUIDE                ║
# ╚══════════════════════════════════════════════════════════════════════╝

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                  📋 MANUAL FRONTEND TESTING CHECKLIST                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREPARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open a FRESH browser window (private/incognito mode recommended)
2. Clear cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Open Developer Console: F12 or right-click → Inspect
4. Keep console open to see any errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1: PUBLIC PAGES (NO LOGIN REQUIRED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 1.1 LANDING PAGE
   URL: http://localhost:3001
   
   Check for:
   □ MARA HCP branding visible
   □ "Get Started" or "Sign In" button
   □ Feature cards displayed
   □ Footer with links
   □ No console errors
   
   Status: ___________

□ 1.2 LOGIN PAGE
   URL: http://localhost:3001/login
   
   Check for:
   □ Email input field
   □ Password input field
   □ Role selection (Admin/Customer)
   □ Login button
   □ No console errors
   
   Status: ___________

□ 1.3 REGISTER PAGE
   URL: http://localhost:3001/register
   
   Check for:
   □ Registration form
   □ All required fields
   □ Submit button
   
   Status: ___________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2: ADMIN SCREENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOGIN AS ADMIN:
   1. Go to: http://localhost:3001/login
   2. Select: Admin
   3. Enter: admin@mara.com / admin123
   4. Click Login
   5. Should redirect to: /app/dashboard

□ 2.1 ADMIN DASHBOARD
   URL: http://localhost:3001/app/dashboard
   
   Check for:
   □ Platform-wide KPIs displayed
   □ Revenue metrics
   □ Resource utilization charts
   □ All customers' workloads visible
   □ System health indicators
   □ No blank screen
   □ No console errors
   
   Status: ___________
   Notes: _________________________________

□ 2.2 RESOURCES PAGE
   URL: http://localhost:3001/app/resources
   
   Check for:
   □ List of all GPU and ASIC resources
   □ Resource status (Active/Idle/Warning)
   □ Utilization percentages
   □ Temperature and power metrics
   □ Filter/search functionality
   □ Facility information
   □ Can click on resource for details
   
   Status: ___________
   Notes: _________________________________

□ 2.3 WORKLOADS PAGE
   URL: http://localhost:3001/app/workloads
   
   Check for:
   □ List of all workloads (all customers)
   □ Workload types (AI Inference, Mining, Training)
   □ Status indicators
   □ Priority levels
   □ Customer column visible (admin only)
   □ Can submit new workload
   □ Can filter by status/type
   
   Status: ___________
   Notes: _________________________________

□ 2.4 BILLING PAGE
   URL: http://localhost:3001/app/billing
   
   Check for:
   □ Platform revenue metrics
   □ All customers' billing data
   □ Invoice generation
   □ Payment tracking
   □ Revenue charts/graphs
   □ Budget overview
   
   Status: ___________
   Notes: _________________________________

□ 2.5 SETTINGS PAGE
   URL: http://localhost:3001/app/settings
   
   Check for:
   □ Admin profile settings
   □ System configuration options
   □ User management (admin only)
   □ API key management
   □ Notification preferences
   
   Status: ___________
   Notes: _________________________________

□ 2.6 ALERTS PAGE
   URL: http://localhost:3001/app/alerts
   
   Check for:
   □ System-wide alerts
   □ Critical/Warning/Info levels
   □ All facilities' alerts
   □ Alert filtering
   □ Alert acknowledgment
   
   Status: ___________
   Notes: _________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3: CUSTOMER SCREENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOGOUT AND LOGIN AS CUSTOMER:
   1. Logout (if logged in) or open new private window
   2. Go to: http://localhost:3001/login
   3. Select: Customer
   4. Enter: john@acme.com / customer123
   5. Click Login
   6. Should redirect to: /app/dashboard

□ 3.1 CUSTOMER DASHBOARD
   URL: http://localhost:3001/app/dashboard
   
   Check for:
   □ Personal KPIs only (not platform-wide)
   □ Own workloads only
   □ Budget tracking
   □ Personal usage metrics
   □ No other customers' data visible
   □ Submit workload button
   
   Status: ___________
   Notes: _________________________________

□ 3.2 WORKLOADS PAGE (Customer View)
   URL: http://localhost:3001/app/workloads
   
   Check for:
   □ Only THIS customer's workloads
   □ No other customers' data
   □ Submit new workload button
   □ Workload status tracking
   □ GPU utilization for own workloads
   
   Status: ___________
   Notes: _________________________________

□ 3.3 BILLING PAGE (Customer View)
   URL: http://localhost:3001/app/billing
   
   Check for:
   □ Personal spending only
   □ Budget tracking
   □ Invoice history (own invoices)
   □ Cost breakdown by workload type
   □ Payment methods
   
   Status: ___________
   Notes: _________________________________

□ 3.4 SETTINGS PAGE (Customer View)
   URL: http://localhost:3001/app/settings
   
   Check for:
   □ Personal profile
   □ Company information
   □ API keys
   □ Notification preferences
   □ No admin-only options
   
   Status: ___________
   Notes: _________________________________

□ 3.5 ALERTS PAGE (Customer View)
   URL: http://localhost:3001/app/alerts
   
   Check for:
   □ Personal alerts only
   □ Workload notifications
   □ Budget warnings
   □ No system-wide alerts
   
   Status: ___________
   Notes: _________________________________

□ 3.6 HELP PAGE
   URL: http://localhost:3001/app/help
   
   Check for:
   □ FAQ section
   □ Documentation links
   □ Support contact info
   □ Submit support ticket
   
   Status: ___________
   Notes: _________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4: INTERACTIVE FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 4.1 ROLE SWITCHER (Development Feature)
   Check for:
   □ Floating button on right side
   □ Can toggle between Admin/Customer
   □ UI updates when switching roles
   
   Status: ___________

□ 4.2 NAVIGATION
   Check for:
   □ Sidebar menu works
   □ All links navigate correctly
   □ Back button works
   □ Breadcrumbs (if present)
   
   Status: ___________

□ 4.3 RESPONSIVE DESIGN
   Test at different sizes:
   □ Desktop (1920x1080)
   □ Tablet (768px)
   □ Mobile (375px)
   
   Status: ___________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests: _____
Passed: _____
Failed: _____

Common Issues Found:
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

Critical Bugs:
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

Notes:
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPECTED RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All pages should load without blank screens
✅ No JavaScript errors in console
✅ Admin sees platform-wide data
✅ Customer sees only personal data
✅ Navigation works smoothly
✅ Data is displayed correctly
✅ UI is responsive and professional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Testing Complete!

Save this checklist for future reference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

