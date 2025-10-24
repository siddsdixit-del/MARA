import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Memory as ResourcesIcon,
  WorkOutline as WorkloadsIcon,
  AttachMoney as BillingIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Warning as AlertIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Visibility as VisualizationIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard' },
  { text: 'Visualization', icon: <VisualizationIcon />, path: '/app/visualization' },
  { text: 'Resources', icon: <ResourcesIcon />, path: '/app/resources' },
  { text: 'Workloads', icon: <WorkloadsIcon />, path: '/app/workloads' },
  { text: 'Billing', icon: <BillingIcon />, path: '/app/billing' },
  { text: 'Alerts', icon: <AlertIcon />, path: '/app/alerts' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings' },
];

const customerMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard' },
  { text: 'My Workloads', icon: <WorkloadsIcon />, path: '/app/workloads' },
  { text: 'Billing & Usage', icon: <BillingIcon />, path: '/app/billing' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/app/settings' },
  { text: 'Help & Support', icon: <HelpIcon />, path: '/app/help' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If no user, this shouldn't render (ProtectedRoute handles redirect)
  if (!user) return null;

  const menuItems = user.role === 'admin' ? adminMenuItems : customerMenuItems;

  const drawer = (
    <Box>
      <Toolbar sx={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' }}>
        <Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MARA HCP
          </Typography>
          <Chip
            label={user.role === 'admin' ? 'Admin Portal' : 'Customer Portal'}
            size="small"
            sx={{
              mt: 0.5,
              height: 20,
              fontSize: '0.7rem',
              backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              color: user.role === 'admin' ? '#EF4444' : '#3B82F6',
            }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path || location.pathname === item.path.replace('/app', '')}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  borderLeft: '3px solid #3B82F6',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: (location.pathname === item.path || location.pathname === item.path.replace('/app', '')) ? '#3B82F6' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#1A1A1A',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
              {user.company}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={user.role === 'admin' ? 12 : 3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar sx={{ bgcolor: '#3B82F6', width: 36, height: 36 }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1A1A1A',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1A1A1A',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

