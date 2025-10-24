import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Chip,
} from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { platformBilling, customers } from '../data/adminData';
import { customerBilling, customerProfile } from '../data/customerData';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16'];

export default function Billing() {
  const { user } = useAuth();

  if (user.role === 'admin') {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Platform Billing & Revenue
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Revenue (MTD)
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ${platformBilling.currentMonth.total.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +15.2% vs last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Active Customers
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {customers.length}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +2 new this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Avg Revenue per Customer
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ${Math.round(platformBilling.currentMonth.total / customers.length).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +8.5% growth
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Revenue Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformBilling.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#A0A0A0" tickFormatter={(value) => value.slice(5)} />
                    <YAxis stroke="#A0A0A0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="btcMining" stackId="a" fill="#F59E0B" name="BTC Mining" />
                    <Bar dataKey="aiInference" stackId="a" fill="#3B82F6" name="AI Inference" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Revenue by Customer
                </Typography>
                <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Tier</TableCell>
                        <TableCell>Monthly Budget</TableCell>
                        <TableCell>Current Spend</TableCell>
                        <TableCell>Utilization</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {platformBilling.currentMonth.byCustomer.map((item) => (
                        <TableRow key={item.customer} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{item.customer}</TableCell>
                          <TableCell>
                            <Chip 
                              label={customers.find(c => c.name === item.customer)?.tier || 'N/A'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>${item.budget.toLocaleString()}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>${item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={item.utilization}
                                sx={{
                                  width: 100,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                  '& .MuiLinearProgress-bar': {
                                    background: item.utilization > 90 ? '#EF4444' : item.utilization > 75 ? '#F59E0B' : '#10B981',
                                  },
                                }}
                              />
                              <Typography variant="body2">{item.utilization.toFixed(0)}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.utilization > 90 ? 'At Risk' : item.utilization > 75 ? 'Warning' : 'On Track'}
                              size="small"
                              color={item.utilization > 90 ? 'error' : item.utilization > 75 ? 'warning' : 'success'}
                            />
                          </TableCell>
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

  // Customer view
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Billing & Usage
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Month
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                ${customerBilling.currentMonth.total.toLocaleString()}
              </Typography>
              <Typography variant="body2" color={customerBilling.currentMonth.onTrack ? 'success.main' : 'warning.main'}>
                {customerBilling.currentMonth.utilizationPercent}% of budget
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Budget Remaining
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                ${customerBilling.currentMonth.budgetRemaining.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {customerBilling.currentMonth.daysRemaining} days left
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Projected Month-End
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                ${customerBilling.currentMonth.estimatedMonthEnd.toLocaleString()}
              </Typography>
              <Typography variant="body2" color={customerBilling.currentMonth.onTrack ? 'success.main' : 'error.main'}>
                {customerBilling.currentMonth.onTrack ? '✓ On track' : '⚠ Over budget'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total GPU Hours
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                2,840
              </Typography>
              <Typography variant="body2" color="success.main">
                +12% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Spending
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerBilling.byDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#A0A0A0" tickFormatter={(value) => value.slice(5)} />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#3B82F6" strokeWidth={3} name="Daily Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Spending by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerBilling.byWorkloadType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type.split(' ')[0]} ${percentage.toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cost"
                  >
                    {customerBilling.byWorkloadType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Top Models by Cost
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Model Name</TableCell>
                      <TableCell>Runs</TableCell>
                      <TableCell>Total Cost</TableCell>
                      <TableCell>Avg GPU Utilization</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerBilling.topModels.map((model) => (
                      <TableRow key={model.name} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{model.name}</TableCell>
                        <TableCell>{model.runs}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>${model.cost.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={model.avgUtil}
                              sx={{
                                width: 100,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  background: '#10B981',
                                },
                              }}
                            />
                            <Typography variant="body2">{model.avgUtil}%</Typography>
                          </Box>
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
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Invoice History
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice ID</TableCell>
                      <TableCell>Period</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Paid Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customerBilling.invoices.map((invoice) => (
                      <TableRow key={invoice.id} hover sx={{ cursor: 'pointer' }}>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{invoice.id}</TableCell>
                        <TableCell>{invoice.month}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.paidDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={invoice.status} size="small" color="success" />
                        </TableCell>
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
