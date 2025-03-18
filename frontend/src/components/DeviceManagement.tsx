import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  DeviceHub as DeviceHubIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Device, DeviceProfile, DeviceCredentials } from '../utils/satelliteAnalysis';

interface DeviceManagementProps {
  devices: Device[];
  deviceProfiles: DeviceProfile[];
  onAddDevice: (device: Device, credentials: DeviceCredentials) => Promise<void>;
  onUpdateDevice: (device: Device) => Promise<void>;
  onDeleteDevice: (deviceId: string) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({
  devices,
  deviceProfiles,
  onAddDevice,
  onUpdateDevice,
  onDeleteDevice,
  onRefreshData,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    label: '',
    deviceProfileId: '',
    credentialsType: 'ACCESS_TOKEN',
    credentialsValue: '',
  });

  const handleOpenDialog = (device?: Device) => {
    if (device) {
      setSelectedDevice(device);
      setFormData({
        name: device.name,
        type: device.type,
        label: device.label,
        deviceProfileId: device.deviceProfileId,
        credentialsType: 'ACCESS_TOKEN',
        credentialsValue: '',
      });
    } else {
      setSelectedDevice(null);
      setFormData({
        name: '',
        type: '',
        label: '',
        deviceProfileId: '',
        credentialsType: 'ACCESS_TOKEN',
        credentialsValue: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDevice(null);
  };

  const handleSubmit = async () => {
    try {
      const device: Device = {
        id: selectedDevice?.id || '',
        createdTime: Date.now(),
        name: formData.name,
        type: formData.type,
        label: formData.label,
        deviceProfileId: formData.deviceProfileId,
        deviceData: {
          configuration: {},
          transportConfiguration: {},
          attributes: {},
          telemetry: {},
        },
        firmwareId: '',
        softwareId: '',
        externalId: '',
        customerId: '',
        tenantId: '',
        edgeId: '',
        additionalInfo: {},
      };

      const credentials: DeviceCredentials = {
        id: '',
        createdTime: Date.now(),
        deviceId: device.id,
        credentialsType: formData.credentialsType as DeviceCredentials['credentialsType'],
        credentialsId: device.id,
        credentialsValue: formData.credentialsValue,
      };

      if (selectedDevice) {
        await onUpdateDevice(device);
      } else {
        await onAddDevice(device, credentials);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting device:', error);
    }
  };

  const renderDeviceStatus = (device: Device) => {
    const lastActivity = device.deviceData.telemetry.lastActivity;
    const isActive = lastActivity && Date.now() - lastActivity < 5 * 60 * 1000; // 5 minutes

    return (
      <Chip
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'error'}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              <DeviceHubIcon sx={{ mr: 1 }} />
              Device Management
            </Typography>
            <Box>
              <IconButton onClick={onRefreshData} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Device
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Profile</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      {deviceProfiles.find((p) => p.id === device.deviceProfileId)?.name}
                    </TableCell>
                    <TableCell>{renderDeviceStatus(device)}</TableCell>
                    <TableCell>
                      {device.deviceData.telemetry.lastActivity
                        ? new Date(device.deviceData.telemetry.lastActivity).toLocaleString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(device)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => onDeleteDevice(device.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDevice ? 'Edit Device' : 'Add New Device'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Device Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Device Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Device Profile</InputLabel>
                <Select
                  value={formData.deviceProfileId}
                  onChange={(e) => setFormData({ ...formData, deviceProfileId: e.target.value })}
                >
                  {deviceProfiles.map((profile) => (
                    <MenuItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Credentials Type</InputLabel>
                <Select
                  value={formData.credentialsType}
                  onChange={(e) => setFormData({ ...formData, credentialsType: e.target.value })}
                >
                  <MenuItem value="ACCESS_TOKEN">Access Token</MenuItem>
                  <MenuItem value="X509_CERTIFICATE">X.509 Certificate</MenuItem>
                  <MenuItem value="MQTT_BASIC">MQTT Basic</MenuItem>
                  <MenuItem value="LWM2M_CREDENTIALS">LwM2M Credentials</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Credentials Value"
                value={formData.credentialsValue}
                onChange={(e) => setFormData({ ...formData, credentialsValue: e.target.value })}
                type="password"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedDevice ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceManagement; 