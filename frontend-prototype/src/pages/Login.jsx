import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Login as LoginIcon, AdminPanelSettings, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, password, role);
    
    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MARA HCP
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Hybrid Compute Platform
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                Login as:
              </Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(e, v) => v && setRole(v)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="customer" sx={{ display: 'flex', gap: 1 }}>
                  <Person />
                  Customer
                </ToggleButton>
                <ToggleButton value="admin" sx={{ display: 'flex', gap: 1 }}>
                  <AdminPanelSettings />
                  Admin
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <form onSubmit={handleSubmit}>
              {error && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'error.dark', borderRadius: 1 }}>
                  <Typography color="error.contrastText">{error}</Typography>
                </Box>
              )}
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" underline="hover">
                  Forgot password?
                </Link>
              </Box>

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                endIcon={<LoginIcon />}
                sx={{ mb: 2 }}
              >
                Sign In
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              startIcon={<LoginIcon />}
            >
              Sign in with SSO
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="/register" underline="hover">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 4 }}
        >
          © 2025 MARA Holdings. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

