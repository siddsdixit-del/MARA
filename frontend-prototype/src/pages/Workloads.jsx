import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
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
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, FilterList } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { allWorkloads } from '../data/adminData';
import { customerWorkloads } from '../data/customerData';

export default function Workloads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Use different data based on role
  const workloads = user.role === 'admin' ? allWorkloads : customerWorkloads;
  const title = user.role === 'admin' ? 'All Workloads' : 'My Workloads';

  const filteredWorkloads = workloads.filter((w) => {
    const matchesFilter = filter === 'all' || w.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = search === '' || 
      w.id.toLowerCase().includes(search.toLowerCase()) ||
      w.type.toLowerCase().includes(search.toLowerCase()) ||
      (w.name && w.name.toLowerCase().includes(search.toLowerCase())) ||
      (w.customer && w.customer.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role === 'admin' 
              ? `${workloads.length} total workloads across all customers`
              : `${workloads.filter(w => w.status === 'Running').length} running, ${workloads.filter(w => w.status === 'Queued').length} queued`
            }
          </Typography>
        </Box>
        {user.role === 'customer' && (
          <Button variant="contained" startIcon={<Add />} size="large">
            Submit New Workload
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 300 }}
              placeholder="Search by ID, type, name..."
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter}
                label="Status"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="running">Running</MenuItem>
                <MenuItem value="queued">Queued</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Workload ID</TableCell>
                  {user.role === 'customer' && <TableCell>Name</TableCell>}
                  {user.role === 'admin' && <TableCell>Customer</TableCell>}
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Resources</TableCell>
                  {user.role === 'admin' && <TableCell>Facility</TableCell>}
                  <TableCell>Runtime</TableCell>
                  <TableCell>Cost</TableCell>
                  {user.role === 'customer' && <TableCell>GPU Util</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkloads.map((workload) => (
                  <TableRow
                    key={workload.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/workloads/${workload.id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {workload.id}
                      </Typography>
                    </TableCell>
                    {user.role === 'customer' && (
                      <TableCell>
                        <Typography variant="body2">{workload.name || '--'}</Typography>
                      </TableCell>
                    )}
                    {user.role === 'admin' && <TableCell>{workload.customer}</TableCell>}
                    <TableCell>{workload.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={workload.status}
                        size="small"
                        color={
                          workload.status === 'Running'
                            ? 'success'
                            : workload.status === 'Queued'
                            ? 'info'
                            : workload.status === 'Completed'
                            ? 'default'
                            : 'error'
                        }
                      />
                    </TableCell>
                    <TableCell>{workload.resources}</TableCell>
                    {user.role === 'admin' && <TableCell>{workload.facility || '--'}</TableCell>}
                    <TableCell>{workload.runtime}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ${typeof workload.cost === 'number' ? workload.cost.toFixed(2) : workload.cost}
                    </TableCell>
                    {user.role === 'customer' && (
                      <TableCell>
                        <Typography variant="body2" color={workload.gpuUtilization > 90 ? 'success.main' : 'text.secondary'}>
                          {workload.gpuUtilization ? `${workload.gpuUtilization}%` : '--'}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Showing {filteredWorkloads.length} of {workloads.length} workloads
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
