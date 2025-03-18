import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { EnvironmentalData } from '../utils/api';

interface DataStatisticsProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataStatistics: React.FC<DataStatisticsProps> = ({
  data,
  loading = false,
}) => {
  const calculateStats = () => {
    if (!data.length) return null;

    const values = data.map((d) => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate standard deviation
    const variance =
      values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      count: data.length,
      average: avg.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      stdDev: stdDev.toFixed(2),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Total Records
          </Typography>
          <Typography variant="h4">{stats.count}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Average
          </Typography>
          <Typography variant="h4">{stats.average}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Min / Max
          </Typography>
          <Typography variant="h4">
            {stats.min} / {stats.max}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Std Dev
          </Typography>
          <Typography variant="h4">{stats.stdDev}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}; 