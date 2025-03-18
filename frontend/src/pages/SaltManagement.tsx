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
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Device, SaltState, SaltPillar, SaltJob } from '../utils/satelliteAnalysis';

const SaltManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openStateDialog, setOpenStateDialog] = useState(false);
  const [openPillarDialog, setOpenPillarDialog] = useState(false);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [selectedState, setSelectedState] = useState<SaltState | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<SaltPillar | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [states, setStates] = useState<SaltState[]>([]);
  const [pillars, setPillars] = useState<SaltPillar[]>([]);
  const [jobs, setJobs] = useState<SaltJob[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenStateDialog = (state?: SaltState) => {
    setSelectedState(state || null);
    setOpenStateDialog(true);
  };

  const handleOpenPillarDialog = (pillar?: SaltPillar) => {
    setSelectedPillar(pillar || null);
    setOpenPillarDialog(true);
  };

  const handleOpenJobDialog = () => {
    setOpenJobDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenStateDialog(false);
    setOpenPillarDialog(false);
    setOpenJobDialog(false);
    setSelectedState(null);
    setSelectedPillar(null);
    setActiveStep(0);
  };

  const handleSaveState = () => {
    if (selectedState) {
      if (selectedState.id) {
        setStates(states.map(s => s.id === selectedState.id ? selectedState : s));
      } else {
        setStates([...states, { ...selectedState, id: `state-${Date.now()}` }]);
      }
    }
    handleCloseDialog();
  };

  const handleSavePillar = () => {
    if (selectedPillar) {
      if (selectedPillar.id) {
        setPillars(pillars.map(p => p.id === selectedPillar.id ? selectedPillar : p));
      } else {
        setPillars([...pillars, { ...selectedPillar, id: `pillar-${Date.now()}` }]);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteState = (stateId: string) => {
    setStates(states.filter(s => s.id !== stateId));
  };

  const handleDeletePillar = (pillarId: string) => {
    setPillars(pillars.filter(p => p.id !== pillarId));
  };

  const renderStateStatus = (state: SaltState) => {
    const isActive = state.metadata.modified > Date.now() - 24 * 60 * 60 * 1000;
    return (
      <Chip
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'error'}
        size="small"
      />
    );
  };

  const renderJobStatus = (job: SaltJob) => {
    const statusColors = {
      pending: 'default',
      running: 'primary',
      completed: 'success',
      failed: 'error',
    };
    return (
      <Chip
        label={job.status}
        color={statusColors[job.status]}
        size="small"
      />
    );
  };

  const renderVerificationStatus = (state: SaltState) => {
    const verification = state.verification.find(v => v.type === 'consensus');
    if (!verification) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={`${verification.consensus.requiredVerifiers} Verifiers`}
          color="primary"
          size="small"
        />
        <Chip
          label={`${verification.consensus.minimumStake} Stake`}
          color="secondary"
          size="small"
        />
        <Chip
          label={state.metadata.decentralization.consensusReached ? 'Consensus Reached' : 'Pending'}
          color={state.metadata.decentralization.consensusReached ? 'success' : 'warning'}
          size="small"
        />
      </Box>
    );
  };

  const renderStateDialogContent = () => (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>Basic Information</StepLabel>
        <StepContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={selectedState?.name || ''}
                onChange={(e) => setSelectedState({ ...selectedState!, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={selectedState?.description || ''}
                onChange={(e) => setSelectedState({ ...selectedState!, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedState?.type || 'device'}
                  onChange={(e) => setSelectedState({ ...selectedState!, type: e.target.value as SaltState['type'] })}
                >
                  <MenuItem value="device">Device</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                  <MenuItem value="configuration">Configuration</MenuItem>
                  <MenuItem value="monitoring">Monitoring</MenuItem>
                  <MenuItem value="verification">Verification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Priority"
                value={selectedState?.priority || 0}
                onChange={(e) => setSelectedState({ ...selectedState!, priority: parseInt(e.target.value) })}
              />
            </Grid>
          </Grid>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Actions</StepLabel>
        <StepContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={selectedState?.actions[0]?.type || 'command'}
                  onChange={(e) => setSelectedState({
                    ...selectedState!,
                    actions: [{
                      ...selectedState!.actions[0],
                      type: e.target.value as SaltState['actions'][0]['type'],
                    }],
                  })}
                >
                  <MenuItem value="command">Command</MenuItem>
                  <MenuItem value="script">Script</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="package">Package</MenuItem>
                  <MenuItem value="verification">Verification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Verification</StepLabel>
        <StepContent>
          {selectedState?.verification[0]?.type === 'consensus' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Required Verifiers"
                  value={selectedState.verification[0].consensus.requiredVerifiers || 5}
                  onChange={(e) => setSelectedState({
                    ...selectedState,
                    verification: [{
                      ...selectedState.verification[0],
                      consensus: {
                        ...selectedState.verification[0].consensus,
                        requiredVerifiers: parseInt(e.target.value),
                      },
                    }],
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum Stake"
                  value={selectedState.verification[0].consensus.minimumStake || 1000}
                  onChange={(e) => setSelectedState({
                    ...selectedState,
                    verification: [{
                      ...selectedState.verification[0],
                      consensus: {
                        ...selectedState.verification[0].consensus,
                        minimumStake: parseInt(e.target.value),
                      },
                    }],
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Verification Period (hours)"
                  value={selectedState.verification[0].consensus.verificationPeriod / (60 * 60 * 1000) || 24}
                  onChange={(e) => setSelectedState({
                    ...selectedState,
                    verification: [{
                      ...selectedState.verification[0],
                      consensus: {
                        ...selectedState.verification[0].consensus,
                        verificationPeriod: parseInt(e.target.value) * 60 * 60 * 1000,
                      },
                    }],
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Challenge Period (days)"
                  value={selectedState.verification[0].consensus.challengePeriod / (24 * 60 * 60 * 1000) || 7}
                  onChange={(e) => setSelectedState({
                    ...selectedState,
                    verification: [{
                      ...selectedState.verification[0],
                      consensus: {
                        ...selectedState.verification[0].consensus,
                        challengePeriod: parseInt(e.target.value) * 24 * 60 * 60 * 1000,
                      },
                    }],
                  })}
                />
              </Grid>
            </Grid>
          )}
        </StepContent>
      </Step>
    </Stepper>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Salt Management</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenStateDialog()}
            sx={{ mr: 1 }}
          >
            Add State
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleOpenJobDialog}
          >
            Run Job
          </Button>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="States" />
        <Tab label="Pillars" />
        <Tab label="Jobs" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verification</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {states.map((state) => (
                  <TableRow key={state.id}>
                    <TableCell>{state.name}</TableCell>
                    <TableCell>{state.type}</TableCell>
                    <TableCell>{state.priority}</TableCell>
                    <TableCell>{renderStateStatus(state)}</TableCell>
                    <TableCell>{renderVerificationStatus(state)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenStateDialog(state)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteState(state.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pillars.map((pillar) => (
                  <TableRow key={pillar.id}>
                    <TableCell>{pillar.name}</TableCell>
                    <TableCell>{pillar.version}</TableCell>
                    <TableCell>
                      {pillar.scope.devices.length} devices
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenPillarDialog(pillar)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePillar(pillar.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 2 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.id}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>
                      {job.target.devices.length} devices
                    </TableCell>
                    <TableCell>{renderJobStatus(job)}</TableCell>
                    <TableCell>
                      {job.metadata.completed
                        ? `${((job.metadata.completed - job.metadata.started) / 1000).toFixed(2)}s`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* State Dialog */}
      <Dialog open={openStateDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedState ? 'Edit State' : 'Add New State'}
        </DialogTitle>
        <DialogContent>
          {renderStateDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              if (activeStep === 2) {
                handleCloseDialog();
                handleSaveState();
              } else {
                setActiveStep((prevStep) => prevStep + 1);
              }
            }}
            variant="contained"
            color="primary"
          >
            {activeStep === 2 ? 'Save' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pillar Dialog */}
      <Dialog open={openPillarDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPillar ? 'Edit Pillar' : 'Add New Pillar'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={selectedPillar?.name || ''}
                onChange={(e) => setSelectedPillar({ ...selectedPillar!, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={selectedPillar?.description || ''}
                onChange={(e) => setSelectedPillar({ ...selectedPillar!, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Devices</InputLabel>
                <Select
                  multiple
                  value={selectedPillar?.scope.devices || []}
                  onChange={(e) => setSelectedPillar({
                    ...selectedPillar!,
                    scope: {
                      ...selectedPillar!.scope,
                      devices: e.target.value as string[],
                    },
                  })}
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePillar} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Dialog */}
      <Dialog open={openJobDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Schedule New Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value="state"
                  onChange={(e) => {}}
                >
                  <MenuItem value="state">State</MenuItem>
                  <MenuItem value="command">Command</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Target Devices</InputLabel>
                <Select
                  multiple
                  value={[]}
                  onChange={(e) => {}}
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Schedule Type</InputLabel>
                <Select
                  value="immediate"
                  onChange={(e) => {}}
                >
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="cron">Cron</MenuItem>
                  <MenuItem value="interval">Interval</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              handleCloseDialog();
              // Implement job scheduling logic
            }}
            variant="contained"
            color="primary"
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SaltManagement; 