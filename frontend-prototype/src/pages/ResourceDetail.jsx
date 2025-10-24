import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { ArrowBack, Sync, Pause, Build, Notifications } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const metricsData = [
  { time: '13:00', utilization: 82, temperature: 70, power: 640 },
  { time: '13:01', utilization: 85, temperature: 71, power: 650 },
  { time: '13:02', utilization: 87, temperature: 72, power: 650 },
  { time: '13:03', utilization: 89, temperature: 73, power: 660 },
  { time: '13:04', utilization: 87, temperature: 72, power: 650 },
];

const events = [
  { time: '13:24', type: 'info', message: 'Utilization increased to 87%' },
  { time: '12:45', type: 'success', message: 'Workload wl-xyz999 completed successfully' },
  { time: '11:30', type: 'info', message: 'New workload wl-abc123 started' },
  { time: '11:29', type: 'success', message: 'Health check passed' },
  { time: '10:15', type: 'info', message: 'Utilization decreased to 45%' },
  { time: '09:30', type: 'warning', message: 'Temperature reached 76°C (threshold warning)' },
];

export default function ResourceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/resources')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600, flexGrow: 1 }}>
          {id || 'GPU-1234'}
        </Typography>
        <Chip label="Healthy" color="success" />
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            NVIDIA H100 80GB
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Serial: NK42-8F3D-9A2E-1B7C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Purchased: Jan 2025
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Rack 2, Position 15
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Facility: Texas-1
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                UTILIZATION
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                87%
              </Typography>
              <Typography variant="caption" color="success.main">
                Normal range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                TEMPERATURE
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                72°C
              </Typography>
              <Typography variant="caption" color="success.main">
                Normal range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                POWER DRAW
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                650W
              </Typography>
              <Typography variant="caption" color="success.main">
                Normal range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                MEMORY
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                64/80 GB
              </Typography>
              <Typography variant="caption" color="text.secondary">
                80% used
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Real-Time Metrics (Last 5 Minutes)
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="utilization" stroke="#3B82F6" strokeWidth={2} name="Utilization %" />
                  <Line type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} name="Temperature °C" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Workload
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ID: wl-abc123
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: AI Inference (Real-time)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer: Acme Corp
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Started: 2h 34m ago
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority: 3/10 (Normal)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Estimated completion: 3h 15m
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cost so far: $109.25
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                View Workload Details →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Status
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Overall"
                    secondary="✓ Healthy"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Hardware"
                    secondary="✓ No errors"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Thermal"
                    secondary="✓ Normal range"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Network"
                    secondary="✓ Connected"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Last check" secondary="5 seconds ago" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Uptime" secondary="99.98% (30 days)" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Events
              </Typography>
              <List>
                {events.map((event, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {event.time}
                          </Typography>
                          <Typography variant="body2">{event.message}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<Sync />}>
          Switch Workload
        </Button>
        <Button variant="outlined" startIcon={<Pause />}>
          Pause
        </Button>
        <Button variant="outlined" startIcon={<Build />}>
          Maintenance
        </Button>
        <Button variant="outlined" startIcon={<Notifications />}>
          Set Alerts
        </Button>
      </Box>
    </Box>
  );
}

