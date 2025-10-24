import { Box, ToggleButtonGroup, ToggleButton, Paper, Typography } from '@mui/material';
import { AdminPanelSettings, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  const handleChange = (event, newRole) => {
    if (newRole !== null) {
      switchRole(newRole);
    }
  };

  // Don't render if user is not logged in
  if (!user) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        p: 2,
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}
    >
      <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>
        🎭 VIEW AS (Prototype Only)
      </Typography>
      <ToggleButtonGroup
        value={user.role}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            px: 2,
            py: 0.5,
          },
        }}
      >
        <ToggleButton value="admin" sx={{ display: 'flex', gap: 1 }}>
          <AdminPanelSettings fontSize="small" />
          Admin
        </ToggleButton>
        <ToggleButton value="customer" sx={{ display: 'flex', gap: 1 }}>
          <Person fontSize="small" />
          Customer
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
        Logged in as: {user.name}
      </Typography>
    </Paper>
  );
}

