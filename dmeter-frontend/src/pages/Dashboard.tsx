import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Environmental Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <Typography variant="h6">Air Quality Index</Typography>
          {/* Air quality chart will go here */}
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <Typography variant="h6">Weather Conditions</Typography>
          {/* Weather data will go here */}
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <Typography variant="h6">Environmental Assets</Typography>
          {/* Asset summary will go here */}
        </Item>
      </Grid>
      <Grid item xs={12} md={6}>
        <Item>
          <Typography variant="h6">Salt Management Status</Typography>
          {/* Salt management data will go here */}
        </Item>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 