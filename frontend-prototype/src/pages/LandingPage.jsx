import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Stack,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  CloudQueue as CloudIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleGetStarted = () => {
    setLoginOpen(true);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole) {
      localStorage.setItem('userRole', selectedRole);
      navigate('/app/dashboard');
    }
  };

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Real-Time Optimization',
      description: 'Dynamically allocate resources between Bitcoin mining and AI inference based on market conditions.',
    },
    {
      icon: <MemoryIcon sx={{ fontSize: 40 }} />,
      title: 'Hybrid Compute',
      description: 'Seamlessly switch between GPU and ASIC workloads with sub-second transition times.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      title: 'Cloud-Native',
      description: 'Built on Kubernetes with microservices architecture for unlimited scalability.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Economic Engine',
      description: 'AI-powered profitability optimization across electricity prices, crypto markets, and compute demand.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II compliant with end-to-end encryption and comprehensive audit logging.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Analytics',
      description: 'Real-time monitoring, predictive analytics, and comprehensive reporting dashboards.',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<500ms', label: 'Workload Switching' },
    { value: '24/7', label: 'Support' },
    { value: '100+', label: 'Enterprise Customers' },
  ];

  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: alpha('#000', 0.95),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              component="img"
              src="https://mara.com/wp-content/themes/mara/assets/images/mara-logo.svg"
              alt="MARA"
              sx={{ height: 32, mr: 2, filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <Typography
              variant="h5"
              sx={{
                display: 'none',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em',
              }}
            >
              MARA
            </Typography>
            <Chip 
              label="HCP" 
              size="small" 
              sx={{ 
                ml: 1,
                bgcolor: alpha('#00D4FF', 0.1),
                color: '#00D4FF',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 20,
              }} 
            />
          </Box>
          <Button
            variant="outlined"
            onClick={handleGetStarted}
            sx={{
              borderColor: '#00D4FF',
              color: '#00D4FF',
              '&:hover': {
                borderColor: '#00D4FF',
                bgcolor: alpha('#00D4FF', 0.1),
              },
            }}
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 102, 255, 0.1) 0%, transparent 50%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Hybrid Compute Platform"
                sx={{
                  mb: 3,
                  bgcolor: alpha('#00D4FF', 0.1),
                  color: '#00D4FF',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 900,
                  mb: 3,
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #fff 0%, #00D4FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Maximize ROI with Dynamic Resource Allocation
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Orchestrate Bitcoin mining and AI inference workloads across your infrastructure with real-time economic optimization.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#00D4FF',
                    color: '#000',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    '&:hover': {
                      bgcolor: '#00B8E6',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.open('https://mara.com', '_blank')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: alpha('#fff', 0.05),
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={24}
                sx={{
                  p: 3,
                  bgcolor: alpha('#0066FF', 0.05),
                  borderRadius: 3,
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#00D4FF', mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Enterprise-Grade Features
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 6, color: 'rgba(255,255,255,0.6)' }}
        >
          Everything you need to run a profitable hybrid compute operation
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: alpha('#fff', 0.03),
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha('#00D4FF', 0.05),
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ color: '#00D4FF', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}>
              Ready to Optimize Your Infrastructure?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.6)' }}>
              Join leading mining operators using MARA HCP
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#00D4FF',
                color: '#000',
                px: 5,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: '#00B8E6',
                },
              }}
            >
              Access Platform
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                © 2025 MARA Holdings, Inc. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={3} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#00D4FF' } }}>
                  Privacy
                </Button>
                <Button sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#00D4FF' } }}>
                  Terms
                </Button>
                <Button sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#00D4FF' } }}>
                  Support
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Login Modal */}
      <Dialog 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0a0a0a',
            backgroundImage: 'none',
            border: '1px solid rgba(0, 212, 255, 0.2)',
          }
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Welcome to MARA HCP
            </Typography>
            <IconButton onClick={() => setLoginOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.6)' }}>
            Select your role to access the platform
          </Typography>

          <Stack spacing={2}>
            <Paper
              onClick={() => handleRoleSelect('admin')}
              sx={{
                p: 3,
                cursor: 'pointer',
                bgcolor: selectedRole === 'admin' ? alpha('#00D4FF', 0.1) : alpha('#fff', 0.03),
                border: selectedRole === 'admin' ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha('#00D4FF', 0.05),
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Platform Administrator
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Manage all facilities, resources, and customers
                  </Typography>
                </Box>
                {selectedRole === 'admin' && <CheckIcon sx={{ color: '#00D4FF' }} />}
              </Stack>
            </Paper>

            <Paper
              onClick={() => handleRoleSelect('customer')}
              sx={{
                p: 3,
                cursor: 'pointer',
                bgcolor: selectedRole === 'customer' ? alpha('#00D4FF', 0.1) : alpha('#fff', 0.03),
                border: selectedRole === 'customer' ? '2px solid #00D4FF' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha('#00D4FF', 0.05),
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Customer Portal
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Access your workloads, billing, and analytics
                  </Typography>
                </Box>
                {selectedRole === 'customer' && <CheckIcon sx={{ color: '#00D4FF' }} />}
              </Stack>
            </Paper>
          </Stack>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!selectedRole}
            onClick={handleLogin}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 4,
              bgcolor: '#00D4FF',
              color: '#000',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#00B8E6',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 212, 255, 0.2)',
                color: 'rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Continue to Platform
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage;

