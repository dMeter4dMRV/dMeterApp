import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const SaltManagement: React.FC = () => {
  const saltLevels = {
    current: 75,
    target: 85,
    lastUpdated: '2024-03-18 09:00',
  };

  const recentActivities = [
    { id: 1, activity: 'Salt level check performed', timestamp: '2024-03-18 09:00' },
    { id: 2, activity: 'Salt added to system', timestamp: '2024-03-17 14:30' },
    { id: 3, activity: 'Maintenance check completed', timestamp: '2024-03-16 11:15' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Salt Management System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Salt Levels
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Current Level: {saltLevels.current}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={saltLevels.current}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Target Level: {saltLevels.target}%
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Last Updated: {saltLevels.lastUpdated}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            {/* System status indicators will go here */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.activity}
                      secondary={activity.timestamp}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SaltManagement; 