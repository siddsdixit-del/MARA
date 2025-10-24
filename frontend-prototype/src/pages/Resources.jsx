import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, MoreVert, Memory, Cable } from '@mui/icons-material';
import { useState } from 'react';

const resources = [
  { id: 'GPU-1234', type: 'H100 80GB', facility: 'Texas-1', rack: 'Rack 2-15', status: 'Active', utilization: 87, temp: 72, power: 650, workload: 'wl-abc123' },
  { id: 'GPU-1235', type: 'H100 80GB', facility: 'Texas-1', rack: 'Rack 2-16', status: 'Active', utilization: 99, temp: 78, power: 680, workload: 'wl-def456' },
  { id: 'GPU-1236', type: 'H100 80GB', facility: 'Texas-1', rack: 'Rack 2-17', status: 'Idle', utilization: 0, temp: 45, power: 80, workload: '--' },
  { id: 'ASIC-5678', type: 'S21 XP', facility: 'Texas-2', rack: 'Container-3', status: 'Mining', utilization: 99, temp: 65, power: 3500, workload: 'btc-pool' },
  { id: 'GPU-1237', type: 'L40S 48GB', facility: 'Texas-1', rack: 'Rack 3-04', status: 'Warning', utilization: 85, temp: 83, power: 550, workload: 'wl-ghi789' },
  { id: 'GPU-1238', type: 'H100 80GB', facility: 'Texas-1', rack: 'Rack 1-08', status: 'Maintenance', utilization: 0, temp: null, power: null, workload: '--' },
];

export default function Resources() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Resources
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Resource
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="🔍 Search resources..."
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="All (10,247)" />
            <Tab label="GPUs (10,000)" />
            <Tab label="ASICs (250K)" />
            <Tab label="Storage (247)" />
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Facility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Temp/Power</TableCell>
                  <TableCell>Workload</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow
                    key={resource.id}
                    hover
                    onClick={() => navigate(`/resources/${resource.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {resource.id.startsWith('GPU') ? <Memory sx={{ mr: 1, fontSize: 20 }} /> : <Cable sx={{ mr: 1, fontSize: 20 }} />}
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {resource.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{resource.type}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {resource.rack}
                      </Typography>
                    </TableCell>
                    <TableCell>{resource.facility}</TableCell>
                    <TableCell>
                      <Chip
                        label={resource.status}
                        size="small"
                        color={
                          resource.status === 'Active' || resource.status === 'Mining' ? 'success' :
                          resource.status === 'Warning' ? 'warning' :
                          resource.status === 'Idle' ? 'default' :
                          'error'
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={resource.utilization}
                          sx={{
                            width: 80,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: resource.utilization > 95 ? '#F59E0B' : '#3B82F6',
                            },
                          }}
                        />
                        <Typography variant="caption">{resource.utilization}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        {resource.temp !== null ? `${resource.temp}°C` : '--'}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {resource.power !== null ? `${resource.power}W` : '--'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {resource.workload}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Showing 1-6 of 10,247
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Capacity
            </Typography>
            <Typography variant="h5">10,000 GPUs</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              In Use
            </Typography>
            <Typography variant="h5">8,750 (87.5%)</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available
            </Typography>
            <Typography variant="h5">1,250 (12.5%)</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

