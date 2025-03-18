import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Assessment,
  Warning,
  CheckCircle,
  Error,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { RestorAnalysis } from '../utils/restorIntegration';

interface RestorProjectAnalysisProps {
  analysis: RestorAnalysis;
}

const RestorProjectAnalysis: React.FC<RestorProjectAnalysisProps> = ({ analysis }) => {
  const renderProgressBar = (value: number) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: value >= 0.7 ? '#4caf50' : value >= 0.4 ? '#ff9800' : '#f44336',
            },
          }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {Math.round(value * 100)}%
      </Typography>
    </Box>
  );

  const renderMetricComparison = (
    baseline: number,
    current: number,
    label: string
  ) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Baseline
          </Typography>
          <Typography variant="h6">{baseline.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">
            Current
          </Typography>
          <Typography variant="h6" color={current >= baseline ? 'success.main' : 'error.main'}>
            {current.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const renderRecommendations = () => (
    <List>
      {analysis.recommendations.map((rec, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemIcon>
              {rec.priority === 'high' ? (
                <Error color="error" />
              ) : rec.priority === 'medium' ? (
                <Warning color="warning" />
              ) : (
                <CheckCircle color="success" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={rec.action}
              secondary={rec.impact}
              primaryTypographyProps={{
                color: rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success',
              }}
            />
          </ListItem>
          {index < analysis.recommendations.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Project Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Overall Progress
          </Typography>
          {renderProgressBar(analysis.progress.overall)}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Ecosystem Services
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(analysis.current.ecosystemServices).map(([service, value]) => (
                <Grid item xs={12} sm={6} md={4} key={service}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {service}
                      </Typography>
                      <Typography variant="h6">
                        {value.toFixed(2)}
                      </Typography>
                      <Chip
                        label={`${Math.round(analysis.progress.byMetric[service] * 100)}% progress`}
                        color={analysis.progress.byMetric[service] >= 0.7 ? 'success' : 'warning'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Biodiversity
                </Typography>
                {renderMetricComparison(
                  analysis.baseline.biodiversity.speciesCount,
                  analysis.current.biodiversity.speciesCount,
                  'Species Count'
                )}
                {renderMetricComparison(
                  analysis.baseline.biodiversity.diversityIndex,
                  analysis.current.biodiversity.diversityIndex,
                  'Diversity Index'
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Carbon
                </Typography>
                {renderMetricComparison(
                  analysis.baseline.carbon.stock,
                  analysis.current.carbon.stock,
                  'Carbon Stock (t/ha)'
                )}
                {renderMetricComparison(
                  analysis.baseline.carbon.sequestration,
                  analysis.current.carbon.sequestration,
                  'Carbon Sequestration (t/ha/year)'
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Water
                </Typography>
                {renderMetricComparison(
                  analysis.baseline.water.infiltration,
                  analysis.current.water.infiltration,
                  'Infiltration Rate (mm/hr)'
                )}
                {renderMetricComparison(
                  analysis.baseline.water.retention,
                  analysis.current.water.retention,
                  'Water Retention (mm)'
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Soil
                </Typography>
                {renderMetricComparison(
                  analysis.baseline.soil.organicMatter,
                  analysis.current.soil.organicMatter,
                  'Organic Matter (%)'
                )}
                {renderMetricComparison(
                  analysis.baseline.soil.erosion,
                  analysis.current.soil.erosion,
                  'Erosion Rate (t/ha/year)'
                )}
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {renderRecommendations()}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RestorProjectAnalysis; 