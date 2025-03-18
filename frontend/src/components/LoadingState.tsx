import React from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

interface LoadingStateProps {
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">
          <Typography variant="body1">{error.message}</Typography>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
}; 