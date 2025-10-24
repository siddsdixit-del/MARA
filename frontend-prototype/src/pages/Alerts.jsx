import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { platformAlerts } from '../data/adminData';
import { customerAlerts } from '../data/customerData';

export default function Alerts() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Use different alerts based on role
  const alerts = user.role === 'admin' ? platformAlerts : customerAlerts;

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    return alert.severity === filter;
  });

  const getIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <Error sx={{ color: '#EF4444' }} />;
      case 'warning':
        return <Warning sx={{ color: '#F59E0B' }} />;
      case 'success':
        return <CheckCircle sx={{ color: '#10B981' }} />;
      default:
        return <Info sx={{ color: '#3B82F6' }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'success':
        return '#10B981';
      default:
        return '#3B82F6';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {user.role === 'admin' ? 'System Alerts' : 'My Alerts'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAlerts.filter(a => !a.acknowledged).length} unacknowledged alerts
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="all">All Alerts</MenuItem>
            <MenuItem value="unacknowledged">Unacknowledged</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            {user.role === 'customer' && <MenuItem value="success">Success</MenuItem>}
          </Select>
        </FormControl>
      </Box>

      {/* Critical alerts first */}
      {filteredAlerts.filter(a => a.severity === 'critical').length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#EF4444' }}>
            Critical Alerts
          </Typography>
          {filteredAlerts
            .filter((alert) => alert.severity === 'critical')
            .map((alert) => (
              <Card
                key={alert.id}
                sx={{
                  mb: 2,
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                  backgroundColor: alert.acknowledged ? 'transparent' : 'rgba(239, 68, 68, 0.05)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      {getIcon(alert.severity)}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {alert.title}
                          </Typography>
                          <Chip
                            label={alert.severity.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: `${getSeverityColor(alert.severity)}20`,
                              color: getSeverityColor(alert.severity),
                              fontWeight: 600,
                            }}
                          />
                          {alert.acknowledged && (
                            <Chip label="Acknowledged" size="small" variant="outlined" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {alert.message}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                          {alert.facility && (
                            <Chip label={`Facility: ${alert.facility}`} size="small" variant="outlined" />
                          )}
                          {alert.customer && (
                            <Chip label={`Customer: ${alert.customer}`} size="small" variant="outlined" />
                          )}
                        </Box>
                        {alert.actionable && (
                          <Box sx={{ mt: 2 }}>
                            <Button size="small" variant="contained">
                              {alert.action}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    {!alert.acknowledged && (
                      <IconButton size="small">
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {/* Warning alerts */}
      {filteredAlerts.filter(a => a.severity === 'warning').length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#F59E0B' }}>
            Warnings
          </Typography>
          {filteredAlerts
            .filter((alert) => alert.severity === 'warning')
            .map((alert) => (
              <Card
                key={alert.id}
                sx={{
                  mb: 2,
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                  backgroundColor: alert.acknowledged ? 'transparent' : 'rgba(245, 158, 11, 0.05)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      {getIcon(alert.severity)}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {alert.title}
                          </Typography>
                          {alert.acknowledged && (
                            <Chip label="Acknowledged" size="small" variant="outlined" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {alert.message}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                          {alert.facility && (
                            <Chip label={`Facility: ${alert.facility}`} size="small" variant="outlined" />
                          )}
                          {alert.customer && (
                            <Chip label={`Customer: ${alert.customer}`} size="small" variant="outlined" />
                          )}
                        </Box>
                        {alert.actionable && (
                          <Box sx={{ mt: 2 }}>
                            <Button size="small" variant="outlined">
                              {alert.action}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    {!alert.acknowledged && (
                      <IconButton size="small">
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {/* Info and success alerts */}
      {filteredAlerts.filter(a => a.severity === 'info' || a.severity === 'success').length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#3B82F6' }}>
            Information
          </Typography>
          {filteredAlerts
            .filter((alert) => alert.severity === 'info' || alert.severity === 'success')
            .map((alert) => (
              <Card
                key={alert.id}
                sx={{
                  mb: 2,
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                  opacity: alert.acknowledged ? 0.7 : 1,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      {getIcon(alert.severity)}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {alert.title}
                          </Typography>
                          {alert.acknowledged && (
                            <Chip label="Acknowledged" size="small" variant="outlined" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.timestamp).toLocaleString()}
                        </Typography>
                        {alert.actionable && (
                          <Box sx={{ mt: 2 }}>
                            <Button size="small" variant="text">
                              {alert.action}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    {!alert.acknowledged && (
                      <IconButton size="small">
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircle sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Alerts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filter === 'all' 
                ? 'Everything is running smoothly!'
                : `No ${filter} alerts at this time.`
              }
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
