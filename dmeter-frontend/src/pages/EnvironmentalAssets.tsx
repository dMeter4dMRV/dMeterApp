import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const EnvironmentalAssets: React.FC = () => {
  const assets = [
    { id: 1, name: 'Forest Area 1', type: 'Forest', status: 'Healthy', lastInspection: '2024-03-15' },
    { id: 2, name: 'Wetland Zone A', type: 'Wetland', status: 'Monitoring', lastInspection: '2024-03-10' },
    { id: 3, name: 'Green Corridor B', type: 'Wildlife Corridor', status: 'Healthy', lastInspection: '2024-03-12' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Environmental Assets
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Asset Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Inspection</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>{asset.status}</TableCell>
                      <TableCell>{asset.lastInspection}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Asset Health Distribution
            </Typography>
            {/* Asset health chart will go here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {/* Recent activities list will go here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnvironmentalAssets; 