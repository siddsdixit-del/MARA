import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  WorkOutline,
  Add,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { customerKPIs, customerWorkloads, customerUtilization, customerBilling } from '../data/customerData';

const kpiData = [
  { icon: <AttachMoney />, title: "This Month's Spend", value: `$${customerKPIs.monthlySpend.toLocaleString()}`, change: '+8.2%', color: '#3B82F6' },
  { icon: <TrendingUp />, title: 'Avg GPU Utilization', value: `${customerKPIs.avgGpuUtilization}%`, change: '+3.5%', color: '#10B981' },
  { icon: <WorkOutline />, title: 'My Active Workloads', value: customerKPIs.activeWorkloads.toString(), change: '+2', color: '#8B5CF6' },
  { icon: <AttachMoney />, title: 'Est. Month-End', value: `$${customerKPIs.estimatedMonthEnd.toLocaleString()}`, change: 'On track', color: '#F59E0B' },
];

const chartData = customerUtilization;

const myWorkloads = customerWorkloads
  .filter(w => ['Running', 'Queued', 'Completed'].includes(w.status))
  .slice(0, 6)
  .map(w => ({
    id: w.id,
    name: w.name,
    type: w.type,
    status: w.status,
    resources: w.resources,
    runtime: w.runtime,
    cost: `$${w.cost.toFixed(2)}`,
  }));

function KPICard({ icon, title, value, change, color }) {
  const isPositive = change.startsWith('+') || change === 'On track';
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 1 }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: isPositive ? '#10B981' : '#EF4444' }}
        >
          {change}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            My Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acme Corporation
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} size="large">
          Submit New Workload
        </Button>
      </Box>

      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <KPICard {...kpi} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Resource Utilization & Spending (Last 24 Hours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#A0A0A0" />
                  <YAxis yAxisId="left" stroke="#A0A0A0" />
                  <YAxis yAxisId="right" orientation="right" stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="utilization" stroke="#3B82F6" strokeWidth={2} name="Utilization %" />
                  <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} name="Cost per Hour ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  My Active Workloads
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Workload ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Resources</TableCell>
                      <TableCell>Runtime</TableCell>
                      <TableCell>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myWorkloads.map((workload) => (
                      <TableRow key={workload.id} hover sx={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {workload.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {workload.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{workload.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={workload.status}
                            size="small"
                            color={
                              workload.status === 'Running' ? 'success' :
                              workload.status === 'Queued' ? 'info' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell>{workload.resources}</TableCell>
                        <TableCell>{workload.runtime}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{workload.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Budget Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Monthly Budget</Typography>
                  <Typography variant="body2" color="warning.main">
                    {customerBilling.currentMonth.utilizationPercent}% used
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={customerBilling.currentMonth.utilizationPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Used: ${customerBilling.currentMonth.total.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Budget: ${customerBilling.currentMonth.budget.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                ✓ {customerBilling.currentMonth.onTrack ? 'On track to stay within budget' : 'Approaching budget limit'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button variant="contained" startIcon={<Add />} fullWidth>
                  Submit New Workload
                </Button>
                <Button variant="outlined" fullWidth>
                  View All Workloads
                </Button>
                <Button variant="outlined" fullWidth>
                  View Billing Details
                </Button>
                <Button variant="outlined" fullWidth>
                  Manage API Keys
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

