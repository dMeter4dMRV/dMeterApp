import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Timeline as TimelineIcon,
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
} from '@mui/icons-material';
import { Device } from '../utils/satelliteAnalysis';

interface DeviceTelemetryProps {
  device: Device;
  onRefresh: () => Promise<void>;
  onDownload: () => Promise<void>;
}

type ViewMode = 'timeline' | 'table' | 'bar' | 'line';

const DeviceTelemetry: React.FC<DeviceTelemetryProps> = ({
  device,
  onRefresh,
  onDownload,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [timeRange, setTimeRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    end: new Date(),
  });

  const telemetryKeys = Object.keys(device.deviceData.telemetry);

  const renderTelemetryValue = (key: string, value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return String(value);
  };

  const renderTimelineView = () => (
    <Box sx={{ height: 400, position: 'relative' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Timeline visualization will be implemented here
      </Typography>
      {/* Implement timeline visualization using a charting library */}
    </Box>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            {telemetryKeys.map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Implement table rows with telemetry data */}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderBarView = () => (
    <Box sx={{ height: 400, position: 'relative' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Bar chart visualization will be implemented here
      </Typography>
      {/* Implement bar chart visualization */}
    </Box>
  );

  const renderLineView = () => (
    <Box sx={{ height: 400, position: 'relative' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Line chart visualization will be implemented here
      </Typography>
      {/* Implement line chart visualization */}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              <TimelineIcon sx={{ mr: 1 }} />
              Device Telemetry
            </Typography>
            <Box>
              <Tooltip title="Refresh Data">
                <IconButton onClick={onRefresh} sx={{ mr: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Data">
                <IconButton onClick={onDownload} sx={{ mr: 1 }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Telemetry Key</InputLabel>
                <Select
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                >
                  {telemetryKeys.map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
                  startIcon={<TimelineIcon />}
                  onClick={() => setViewMode('timeline')}
                >
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  startIcon={<TableChartIcon />}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'bar' ? 'contained' : 'outlined'}
                  startIcon={<BarChartIcon />}
                  onClick={() => setViewMode('bar')}
                >
                  Bar
                </Button>
                <Button
                  variant={viewMode === 'line' ? 'contained' : 'outlined'}
                  startIcon={<LineChartIcon />}
                  onClick={() => setViewMode('line')}
                >
                  Line
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Latest Values
            </Typography>
            <Grid container spacing={2}>
              {telemetryKeys.map((key) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {key}
                      </Typography>
                      <Typography variant="h6">
                        {renderTelemetryValue(key, device.deviceData.telemetry[key])}
                      </Typography>
                      <Chip
                        label="Latest"
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            {viewMode === 'timeline' && renderTimelineView()}
            {viewMode === 'table' && renderTableView()}
            {viewMode === 'bar' && renderBarView()}
            {viewMode === 'line' && renderLineView()}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeviceTelemetry; 