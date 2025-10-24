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
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  WorkOutline,
  Warning,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { platformKPIs, allWorkloads, platformUtilization, facilities, platformAlerts } from '../data/adminData';

const kpiData = [
  { icon: <AttachMoney />, title: "Total Revenue", value: `$${platformKPIs.totalRevenue.toLocaleString()}`, change: '+12.3%', color: '#10B981' },
  { icon: <TrendingUp />, title: 'GPU Utilization', value: `${platformKPIs.gpuUtilization}%`, change: '+5.1%', color: '#3B82F6' },
  { icon: <WorkOutline />, title: 'Active Workloads', value: platformKPIs.activeWorkloads.toString(), change: '+8', color: '#8B5CF6' },
  { icon: <Warning />, title: 'Critical Alerts', value: platformAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).length.toString(), change: '-3', color: '#F59E0B' },
];

const chartData = platformUtilization.map(d => ({
  time: d.time,
  Texas1: d.gpuUtil + Math.random() * 4 - 2,
  Texas2: d.gpuUtil + Math.random() * 4 - 4,
  Canada1: d.gpuUtil + Math.random() * 4,
}));

const workloads = allWorkloads
  .filter(w => w.status === 'Running' || w.status === 'Queued')
  .slice(0, 8)
  .map(w => ({
    id: w.id,
    customer: w.customer,
    type: w.type,
    status: w.status,
    resources: w.resources,
    runtime: w.runtime,
    cost: `$${w.cost.toFixed(2)}`,
  }));

function KPICard({ icon, title, value, change, color }) {
  const isPositive = change.startsWith('+');
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

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Executive Dashboard
      </Typography>

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
                GPU Utilization by Facility (Last 24 Hours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                  <Line type="monotone" dataKey="Texas1" stroke="#3B82F6" strokeWidth={2} name="Texas-1" />
                  <Line type="monotone" dataKey="Texas2" stroke="#10B981" strokeWidth={2} name="Texas-2" />
                  <Line type="monotone" dataKey="Canada1" stroke="#8B5CF6" strokeWidth={2} name="Canada-1" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facility Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                {facilities.map((facility) => (
                  <Box key={facility.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{facility.name}</Typography>
                        <Chip
                          label={facility.status}
                          size="small"
                          color={facility.status === 'optimal' ? 'success' : 'warning'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {facility.gpus} GPUs
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={facility.name === 'Texas-1' ? 96 : facility.name === 'Texas-2' ? 94 : 89}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Power: {facility.power} MW
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {facility.name === 'Texas-1' ? '96%' : facility.name === 'Texas-2' ? '94%' : '89%'} utilization
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Critical Alerts
              </Typography>
              <Box sx={{ mt: 2 }}>
                {platformAlerts
                  .filter(a => a.severity === 'critical' && !a.acknowledged)
                  .slice(0, 4)
                  .map((alert) => (
                    <Box
                      key={alert.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderLeft: '4px solid #EF4444',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#EF4444' }}>
                        {alert.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.message}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Workloads (All Customers)
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Workload ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Resources</TableCell>
                      <TableCell>Runtime</TableCell>
                      <TableCell>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workloads.map((workload) => (
                      <TableRow key={workload.id} hover sx={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {workload.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{workload.customer}</TableCell>
                        <TableCell>{workload.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={workload.status}
                            size="small"
                            color={workload.status === 'Running' ? 'success' : 'info'}
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
      </Grid>
    </Box>
  );
}
