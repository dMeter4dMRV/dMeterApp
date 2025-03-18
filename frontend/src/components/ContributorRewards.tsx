import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { useBlockchain } from '../hooks/useBlockchain';

interface ContributorReward {
  projectName: string;
  contributionType: 'data' | 'verification' | 'research';
  amount: number;
  status: 'pending' | 'claimed' | 'expired';
  timestamp: number;
}

export const ContributorRewards: React.FC = () => {
  const { account, connect, disconnect } = useBlockchain();
  const [rewards, setRewards] = React.useState<ContributorReward[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRewards = async () => {
      if (!account) return;
      try {
        // TODO: Implement actual API call to fetch rewards
        const mockRewards: ContributorReward[] = [
          {
            projectName: 'Environmental Data Collection',
            contributionType: 'data',
            amount: 100,
            status: 'pending',
            timestamp: Date.now() - 86400000,
          },
          {
            projectName: 'Data Verification',
            contributionType: 'verification',
            amount: 50,
            status: 'claimed',
            timestamp: Date.now() - 172800000,
          },
        ];
        setRewards(mockRewards);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [account]);

  const handleClaimReward = async (reward: ContributorReward) => {
    try {
      // TODO: Implement actual reward claiming logic
      console.log('Claiming reward:', reward);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Contributor Rewards
        </Typography>
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
        {rewards.map((reward, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {reward.projectName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Contribution Type: {reward.contributionType}
                </Typography>
                <Typography variant="h5" color="primary">
                  {reward.amount} DMT
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Earned on: {formatDate(reward.timestamp)}
                </Typography>
                <Typography
                  variant="body2"
                  color={reward.status === 'pending' ? 'success.main' : 'textSecondary'}
                >
                  Status: {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                {reward.status === 'pending' && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleClaimReward(reward)}
                    disabled={!account}
                  >
                    Claim Reward
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {rewards.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No rewards available yet. Start contributing to earn rewards!
          </Typography>
        </Paper>
      )}
    </Box>
  );
}; 