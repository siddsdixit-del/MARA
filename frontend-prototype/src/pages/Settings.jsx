import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Save, PhotoCamera, MoreVert, Add } from '@mui/icons-material';

const apiKeys = [
  { name: 'Production API', key: 'mk_prod_x...', lastUsed: '2 hours ago', created: 'Jan 15 2025', scope: 'full' },
  { name: 'CI/CD Pipeline', key: 'mk_prod_y...', lastUsed: '1 day ago', created: 'Dec 1 2024', scope: 'submit' },
  { name: 'Local Dev', key: 'mk_dev_a...', lastUsed: 'Just now', created: 'Oct 20 2025', scope: 'read' },
];

export default function Settings() {
  const [tab, setTab] = useState('profile');

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Card>
            <List>
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'team', label: 'Team' },
                { id: 'api', label: 'API Keys' },
                { id: 'billing', label: 'Billing' },
                { id: 'security', label: 'Security' },
                { id: 'notifications', label: 'Notifications' },
              ].map((item) => (
                <ListItem
                  key={item.id}
                  button
                  selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      borderLeft: '3px solid #3B82F6',
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={8} lg={9}>
          {tab === 'profile' && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Profile Information
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: '#3B82F6' }}>
                    JD
                  </Avatar>
                  <Box>
                    <Typography variant="h6">John Doe</Typography>
                    <Typography variant="body2" color="text.secondary">
                      john@acme.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Admin
                    </Typography>
                    <Button size="small" startIcon={<PhotoCamera />} sx={{ mt: 1 }}>
                      Change Photo
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Name" defaultValue="John Doe" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email" defaultValue="john@acme.com" type="email" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Company" defaultValue="Acme Corporation" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Role"
                      defaultValue="admin"
                      SelectProps={{ native: true }}
                    >
                      <option value="admin">Administrator</option>
                      <option value="developer">Developer</option>
                      <option value="viewer">Viewer</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Time Zone"
                      defaultValue="est"
                      SelectProps={{ native: true }}
                    >
                      <option value="est">(UTC-05:00) Eastern Time</option>
                      <option value="pst">(UTC-08:00) Pacific Time</option>
                      <option value="utc">(UTC+00:00) UTC</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Language"
                      defaultValue="en"
                      SelectProps={{ native: true }}
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </TextField>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="outlined">Cancel</Button>
                  <Button variant="contained" startIcon={<Save />}>
                    Save Changes
                  </Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 3 }}>
                  Change Password
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Current Password" type="password" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="New Password" type="password" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Confirm New Password" type="password" />
                  </Grid>
                </Grid>

                <Button variant="contained" sx={{ mt: 2 }}>
                  Update Password
                </Button>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                  Danger Zone
                </Typography>
                <Button variant="outlined" color="error">
                  Delete Account
                </Button>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Warning: This cannot be undone
                </Typography>
              </CardContent>
            </Card>
          )}

          {tab === 'api' && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">API Keys</Typography>
                  <Button variant="contained" startIcon={<Add />}>
                    Create New API Key
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use API keys to access MARA HCP programmatically. Keep your keys secure and never share them publicly.
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Production Keys
                </Typography>
                <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Key Preview</TableCell>
                        <TableCell>Last Used</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiKeys.filter(k => k.scope === 'full' || k.scope === 'submit').map((key) => (
                        <TableRow key={key.name} hover>
                          <TableCell>
                            <Typography variant="body2">{key.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Scopes: {key.scope}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{key.key}</TableCell>
                          <TableCell>{key.lastUsed}</TableCell>
                          <TableCell>{key.created}</TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Development Keys
                </Typography>
                <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Key Preview</TableCell>
                        <TableCell>Last Used</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiKeys.filter(k => k.scope === 'read').map((key) => (
                        <TableRow key={key.name} hover>
                          <TableCell>
                            <Typography variant="body2">{key.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Scopes: {key.scope}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{key.key}</TableCell>
                          <TableCell>{key.lastUsed}</TableCell>
                          <TableCell>{key.created}</TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  API Usage (Last 30 Days)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Total Requests
                        </Typography>
                        <Typography variant="h5">1,245,890</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Success Rate
                        </Typography>
                        <Typography variant="h5">99.98%</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Avg Response Time
                        </Typography>
                        <Typography variant="h5">45ms</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

