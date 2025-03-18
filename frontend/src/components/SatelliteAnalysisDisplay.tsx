import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Satellite,
  Assessment,
  Warning,
  CheckCircle,
  Error,
  Timeline,
  TrendingUp,
  TrendingDown,
  Verified,
  Thermostat,
  WaterDrop,
  Air,
  Forest,
  Water,
  LocationCity,
  HealthAndSafety,
  Eco,
  Vulnerable,
  VerifiedUser,
  Group,
  Security,
  AccountBalance,
  LocationOn,
  Memory,
  Speed,
  Settings,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { environmentalDataService } from '../services/EnvironmentalDataService';
import { SatelliteAnalysisResult } from '../utils/satelliteAnalysis';

interface SatelliteAnalysisDisplayProps {
  analysis: SatelliteAnalysisResult;
  onVerify?: () => void;
}

const SatelliteAnalysisDisplay: React.FC<SatelliteAnalysisDisplayProps> = ({
  analysis,
  onVerify,
}) => {
  const [environmentalData, setEnvironmentalData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await environmentalDataService.getEnvironmentalData(
          analysis.location.lat,
          analysis.location.lng
        );
        setEnvironmentalData(data);
      } catch (error) {
        console.error('Error fetching environmental data:', error);
      }
    };
    fetchData();
  }, [analysis.location]);

  const renderMetricCard = (title: string, value: number | string, subtitle?: string, icon?: React.ReactNode) => (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {icon}
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
        <Typography variant="h6">{value}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const renderProgressBar = (value: number, color?: string) => (
    <LinearProgress
      variant="determinate"
      value={value * 100}
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        '& .MuiLinearProgress-bar': {
          backgroundColor: color || (value < 0.5 ? '#ff9800' : '#4caf50'),
        },
      }}
    />
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Box>
  );

  const renderHealthDeterminants = () => (
    renderSection('Health Determinants', 
      Object.entries(analysis.healthDeterminants).map(([key, value]: [string, any]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          {renderMetricCard(
            key.charAt(0).toUpperCase() + key.slice(1),
            typeof value === 'object' ? value.mean || value.total : value,
            typeof value === 'object' ? `Range: ${value.range || 'N/A'}` : undefined
          )}
        </Grid>
      ))
    )
  );

  const renderEcosystemServices = () => (
    renderSection('Ecosystem Services',
      Object.entries(analysis.ecosystemServices).map(([category, services]: [string, any]) => (
        <Grid item xs={12} sm={6} md={3} key={category}>
          {renderMetricCard(
            category.charAt(0).toUpperCase() + category.slice(1),
            Object.entries(services)
              .map(([service, value]) => 
                `${service}: ${Math.round((value as number) * 100)}%`)
              .join('\n')
          )}
        </Grid>
      ))
    )
  );

  const renderVulnerabilityAssessment = () => (
    renderSection('Vulnerability Assessment',
      Object.entries(analysis.vulnerabilityAssessment).map(([key, value]: [string, any]) => (
        <Grid item xs={12} sm={6} md={3} key={key}>
          {renderMetricCard(
            key.charAt(0).toUpperCase() + key.slice(1),
            Math.round((value as number) * 100) + '%',
            undefined,
            <Warning />
          )}
        </Grid>
      ))
    )
  );

  const renderTrends = () => {
    const data = [
      {
        name: 'Previous',
        ...Object.fromEntries(
          Object.entries(analysis.changes).map(([key, value]) => [
            key,
            (value as any).before * 100,
          ])
        ),
      },
      {
        name: 'Current',
        ...Object.fromEntries(
          Object.entries(analysis.changes).map(([key, value]) => [
            key,
            (value as any).after * 100,
          ])
        ),
      },
    ];

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Environmental Trends
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(analysis.changes).map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={
                      key === 'vegetation'
                        ? '#4caf50'
                        : key === 'builtUp'
                        ? '#9e9e9e'
                        : key === 'waterBodies'
                        ? '#2196f3'
                        : '#f44336'
                    }
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Satellite Analysis Results
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {analysis.config.modelType}
          </Typography>

          {renderHealthDeterminants()}
          {renderEcosystemServices()}
          {renderVulnerabilityAssessment()}
          {renderTrends()}

          {onVerify && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VerifiedUser />}
                onClick={onVerify}
              >
                Verify Analysis
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SatelliteAnalysisDisplay; 