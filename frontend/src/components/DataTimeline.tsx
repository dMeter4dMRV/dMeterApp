import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/material';
import { EnvironmentalData } from '../utils/api';

interface DataTimelineProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataTimeline: React.FC<DataTimelineProps> = ({
  data,
  loading = false,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading timeline...</Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Timeline>
        {data.map((point, index) => (
          <TimelineItem key={point.id}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < data.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" component="div">
                {point.dataType}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatDate(point.timestamp)}
              </Typography>
              <Typography variant="body1">
                Location: {point.location}
              </Typography>
              <Typography variant="body1">
                Value: {point.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Submitted by: {point.submittedBy}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
}; 