# 🔐 MARA HCP - Login Credentials & Authentication Guide

## 🔑 Login Credentials

### Admin Account (Full Platform Access)
```
Email:    admin@mara.com
Password: admin123
```

**Access:**
- Platform-wide dashboard with all KPIs
- All GPU and ASIC resources across facilities
- All customers' workloads
- Platform revenue and billing data
- System-wide alerts
- User management and settings

### Customer Account (Personal Workloads)
```
Email:    john@acme.com
Password: customer123
```

**Access:**
- Personal dashboard with own metrics
- Own workloads only
- Personal billing and budget tracking
- Personal alerts and notifications
- Help and support
- Profile settings

## 🚀 How to Login

1. **Clear Browser Cache**
   - Press `Cmd + Shift + R` (macOS)
   - Or open Incognito window: `Cmd + Shift + N`

2. **Go to Application**
   ```
   http://localhost:3001
   ```

3. **Click "Get Started"** on the landing page
   - Or navigate directly to: `http://localhost:3001/login`

4. **Select Your Role**
   - Toggle to **Customer** (blue icon with person)
   - OR toggle to **Admin** (red icon with shield)

5. **Enter Credentials**
   - Admin: `admin@mara.com` / `admin123`
   - Customer: `john@acme.com` / `customer123`

6. **Click "Sign In"**
   - You'll be redirected to `/app/dashboard`
   - All navigation will work
   - All pages will be accessible based on your role

## 🔐 Authentication Features

### ✅ Required Login
- No auto-login anymore
- Must enter valid credentials
- Protected routes redirect to login

### ✅ Credential Validation
- Email must match valid user
- Password must be correct
- Invalid login shows error message

### ✅ Protected Routes
- All `/app/*` routes require authentication
- Automatic redirect to `/login` if not authenticated
- Session persists until logout

### ✅ Logout Functionality
- Logout button in top-right header (next to avatar)
- Logout icon click → returns to login page
- Clears session data

### ✅ Role-Based Access
- Admin sees platform-wide data
- Customer sees only personal data
- Different navigation menus per role

## 🎯 Quick Test Steps

### Test Admin Access
```
1. Incognito window: Cmd + Shift + N
2. Go to: http://localhost:3001
3. Click "Get Started"
4. Select "Admin" toggle
5. Login: admin@mara.com / admin123
6. Verify: Platform dashboard, all resources visible
7. Test navigation: Resources, Workloads, Billing, Alerts
8. Click logout icon
```

### Test Customer Access
```
1. After logout (or new incognito window)
2. Go to: http://localhost:3001/login
3. Select "Customer" toggle
4. Login: john@acme.com / customer123
5. Verify: Personal dashboard, own workloads only
6. Test navigation: My Workloads, Billing, Help
7. Click logout icon
```

### Test Invalid Login
```
1. Go to login page
2. Enter: wrong@email.com / wrongpass
3. Verify: Red error box appears
4. Message: "Invalid email or password"
5. Cannot proceed without valid credentials
```

### Test Protected Routes
```
1. WITHOUT logging in, try:
   http://localhost:3001/app/dashboard
2. Verify: Automatic redirect to /login
3. Must login first to access
```

## 💡 Important Notes

### Case Sensitivity
- Credentials are **case-sensitive**
- Use lowercase: `admin@mara.com` (not `Admin@mara.com`)
- Passwords exact: `admin123` (not `Admin123`)

### Browser Cache
- **Must clear cache** after this fix
- Old version had auto-login
- Use `Cmd + Shift + R` or Incognito mode

### Logout Before Role Switch
- Click logout icon in header
- Then login with different credentials
- Don't rely on role switcher for real testing

### Role Switcher (Development Only)
- Floating button on right side
- For quick testing during development
- Switches view without re-login
- **NOT** for production use

## 📁 What Was Fixed

### Files Modified
1. **`src/context/AuthContext.jsx`**
   - Removed auto-login (was starting with default user)
   - Added credential validation logic
   - Added `logout()` function
   - Added `isAuthenticated` state

2. **`src/components/ProtectedRoute.jsx`** (NEW)
   - Checks if user is authenticated
   - Redirects to `/login` if not
   - Wraps all `/app/*` routes

3. **`src/pages/Login.jsx`**
   - Validates email and password
   - Shows error messages
   - Redirects to `/app/dashboard` on success

4. **`src/components/Layout.jsx`**
   - Added logout button in header
   - Handles null user safely
   - Fixed navigation paths to use `/app/` prefix

5. **`src/App.jsx`**
   - Wrapped `/app` routes with `ProtectedRoute`
   - Safe null checks with `user?.role`

### Authentication Flow

**Before (Broken):**
```
Start → Auto-logged in → No login page → Can't switch roles properly
```

**After (Fixed):**
```
Start → Landing page → Login required → Valid credentials → Dashboard
        ↓
      Logout → Returns to login
```

## 🔒 Security Features

### Current Implementation
- ✅ Client-side credential validation
- ✅ Protected routes
- ✅ Session management
- ✅ Logout functionality
- ✅ Error handling

### Future Enhancements (Not Yet Implemented)
- ⏳ Backend API authentication
- ⏳ JWT token management
- ⏳ Password hashing
- ⏳ Session expiration
- ⏳ Remember me functionality
- ⏳ SSO integration

## 📝 Credentials Summary

**Quick Reference:**

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@mara.com | admin123 | Platform-wide |
| Customer | john@acme.com | customer123 | Personal only |

## 🆘 Troubleshooting

### Issue: Not seeing login page
**Solution:** Clear cache (`Cmd + Shift + R`) or use Incognito

### Issue: Invalid credentials error
**Solution:** Check case-sensitivity, use exact credentials above

### Issue: Redirected to login after clicking menu
**Solution:** This is expected - login required for all pages

### Issue: Logout button not working
**Solution:** Hard reload (`Cmd + Shift + R`) to get latest code

### Issue: Can't access /app/dashboard directly
**Solution:** This is correct behavior - must login first

## ✅ Status

- ✅ Authentication working
- ✅ Login page functional
- ✅ Credentials validated
- ✅ Protected routes active
- ✅ Logout button added
- ✅ Navigation fixed
- ✅ Role-based access working

## 🎉 Ready to Use!

The authentication system is now fully functional. Open an incognito window and test both admin and customer logins!

```bash
# Quick test:
# 1. Cmd + Shift + N (open incognito)
# 2. Go to http://localhost:3001
# 3. Login with credentials above
# 4. Enjoy the full MARA HCP experience!
```

---

**Last Updated:** October 24, 2025  
**Status:** ✅ Complete and Working  
**Version:** 1.0.0

