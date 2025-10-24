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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import { ArrowBack, Pause, Stop, Refresh, Settings as SettingsIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const performanceData = [
  { time: '13:00', utilization: 82, throughput: 75 },
  { time: '13:01', utilization: 85, throughput: 79 },
  { time: '13:02', utilization: 87, throughput: 81 },
  { time: '13:03', utilization: 89, throughput: 84 },
  { time: '13:04', utilization: 87, throughput: 81 },
];

const resources = [
  { id: 'GPU-1234', location: 'Texas-1 R2-15', utilization: 87, temp: 72, power: 650, status: 'Healthy' },
  { id: 'GPU-1235', location: 'Texas-1 R2-16', utilization: 99, temp: 78, power: 680, status: 'High util' },
  { id: 'GPU-1236', location: 'Texas-1 R2-17', utilization: 85, temp: 70, power: 640, status: 'Healthy' },
  { id: 'GPU-1237', location: 'Texas-1 R2-18', utilization: 89, temp: 73, power: 655, status: 'Healthy' },
];

const logs = [
  { time: '13:24:15', level: 'INFO', message: 'Processed 1,000 requests' },
  { time: '13:24:10', level: 'INFO', message: 'GPU-1235 utilization reached 99%' },
  { time: '13:24:05', level: 'INFO', message: 'Checkpoint saved: checkpoint-152' },
  { time: '13:23:50', level: 'WARN', message: 'Latency spike detected: 95ms' },
  { time: '13:23:40', level: 'INFO', message: 'Auto-scaled: added 2 GPUs' },
];

export default function WorkloadDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/workloads')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600, flexGrow: 1 }}>
          {id || 'wl-abc123'}
        </Typography>
        <Chip label="Running" color="success" />
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Inference (Real-time) • GPT-4 70B
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Customer: Acme Corp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Priority: 3/10 (Normal)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Started: 2h 34m ago
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Est. Complete: 3h 15m
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
                RESOURCES
              </Typography>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                8x H100
              </Typography>
              <Typography variant="caption" color="text.secondary">
                640 GB RAM
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Texas-1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                RUNTIME
              </Typography>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                2h 34m
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Est: 5h 49m
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                COST
              </Typography>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                $109.25
              </Typography>
              <Typography variant="caption" color="text.secondary">
                +$42.50/hr
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                REQUESTS
              </Typography>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                12,450
              </Typography>
              <Typography variant="caption" color="text.secondary">
                81.2 req/sec
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Performance Metrics
                <Chip label="Live" color="success" size="small" sx={{ ml: 2 }} />
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
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
                  <Line type="monotone" dataKey="utilization" stroke="#3B82F6" strokeWidth={2} name="GPU Utilization %" />
                  <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} name="Throughput (req/s)" />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Typography variant="caption">Avg: 87% | Peak: 99% | Min: 72%</Typography>
                <Typography variant="caption">Avg: 81.2 | Peak: 94.5 | Min: 68</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Model" secondary="GPT-4 (70B)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Batch Size" secondary="32" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Max Latency" secondary="100ms" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Auto-scaling" secondary="Enabled" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Checkpoint" secondary="Every 15 min" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Max Cost" secondary="$500.00" />
                </ListItem>
              </List>
              <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                Edit Configuration
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SLA Compliance
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Uptime"
                    secondary="✓ 100%"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Latency"
                    secondary="✓ 45ms (p50)"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Throughput"
                    secondary="✓ 81.2 req/s"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Errors"
                    secondary="✓ 0.02%"
                    secondaryTypographyProps={{ color: 'success.main' }}
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  SLA Target: 99.9%
                </Typography>
                <Typography variant="h6" color="success.main">
                  Current: 100% ✓
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allocated Resources
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>GPU ID</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Utilization</TableCell>
                      <TableCell>Temp</TableCell>
                      <TableCell>Power</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{resource.id}</TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={resource.utilization}
                              sx={{ width: 60, height: 4, borderRadius: 2 }}
                            />
                            <Typography variant="caption">{resource.utilization}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{resource.temp}°C</TableCell>
                        <TableCell>{resource.power}W</TableCell>
                        <TableCell>
                          <Typography variant="caption" color={resource.status === 'Healthy' ? 'success.main' : 'warning.main'}>
                            {resource.status}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Logs & Events
              </Typography>
              <List>
                {logs.map((log, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70 }}>
                            {log.time}
                          </Typography>
                          <Chip
                            label={log.level}
                            size="small"
                            color={log.level === 'WARN' ? 'warning' : 'default'}
                            sx={{ minWidth: 60 }}
                          />
                          <Typography variant="body2">{log.message}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button variant="text" size="small" sx={{ mt: 1 }}>
                View Full Logs →
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="outlined" startIcon={<Pause />}>
          Pause
        </Button>
        <Button variant="outlined" startIcon={<Stop />} color="error">
          Stop
        </Button>
        <Button variant="outlined" startIcon={<Refresh />}>
          Restart
        </Button>
        <Button variant="outlined" startIcon={<SettingsIcon />}>
          Configure
        </Button>
      </Box>
    </Box>
  );
}

