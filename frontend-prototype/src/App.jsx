import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Workloads from './pages/Workloads';
import WorkloadDetail from './pages/WorkloadDetail';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import Help from './pages/Help';

// Layout
import Layout from './components/Layout';
import RoleSwitcher from './components/RoleSwitcher';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function DashboardRouter() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Dashboard /> : <CustomerDashboard />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <RoleSwitcher />
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* App Routes - Protected */}
            <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardRouter />} />
              <Route path="resources" element={<Resources />} />
              <Route path="resources/:id" element={<ResourceDetail />} />
              <Route path="workloads" element={<Workloads />} />
              <Route path="workloads/:id" element={<WorkloadDetail />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="help" element={<Help />} />
            </Route>

            {/* Backward compatibility */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </Router>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

