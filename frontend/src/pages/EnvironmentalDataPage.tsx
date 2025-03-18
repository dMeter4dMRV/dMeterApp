import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, TextField, Grid } from '@mui/material';
import { EnvironmentalDataChart } from '../components/EnvironmentalDataChart';
import { useBlockchain } from '../hooks/useBlockchain';

interface DataPoint {
  timestamp: number;
  value: number;
  location: string;
  dataType: string;
}

export const EnvironmentalDataPage: React.FC = () => {
  const { account, connect, disconnect, submitEnvironmentalData, getEnvironmentalData } = useBlockchain();
  const [data, setData] = useState<DataPoint[]>([]);
  const [newData, setNewData] = useState({
    dataType: '',
    location: '',
    value: ''
  });

  useEffect(() => {
    // Load initial data
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Implementation for loading data
      // This would fetch data from your API or blockchain
      const mockData: DataPoint[] = [
        {
          timestamp: Date.now() - 86400000,
          value: 25,
          location: 'Location 1',
          dataType: 'Temperature'
        },
        {
          timestamp: Date.now(),
          value: 26,
          location: 'Location 1',
          dataType: 'Temperature'
        }
      ];
      setData(mockData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitEnvironmentalData(
        newData.dataType,
        newData.location,
        parseFloat(newData.value)
      );
      setNewData({ dataType: '', location: '', value: '' });
      loadData();
    } catch (error) {
      console.error('Failed to submit data:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Environmental Data
        </Typography>

        <Box sx={{ mb: 4 }}>
          {!account ? (
            <Button variant="contained" onClick={connect}>
              Connect Wallet
            </Button>
          ) : (
            <Button variant="outlined" onClick={disconnect}>
              Disconnect ({account.slice(0, 6)}...{account.slice(-4)})
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Submit New Data
              </Typography>
              <TextField
                fullWidth
                label="Data Type"
                value={newData.dataType}
                onChange={(e) => setNewData({ ...newData, dataType: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Location"
                value={newData.location}
                onChange={(e) => setNewData({ ...newData, location: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={newData.value}
                onChange={(e) => setNewData({ ...newData, value: e.target.value })}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!account}
                sx={{ mt: 2 }}
              >
                Submit Data
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <EnvironmentalDataChart
              data={data}
              title="Environmental Data Over Time"
              dataType="Temperature"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}; 