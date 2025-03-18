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

interface SaltManagementProps {
  devices: Device[];
  states: SaltState[];
  pillars: SaltPillar[];
  jobs: SaltJob[];
  onAddState: (state: SaltState) => Promise<void>;
  onUpdateState: (state: SaltState) => Promise<void>;
  onDeleteState: (stateId: string) => Promise<void>;
  onAddPillar: (pillar: SaltPillar) => Promise<void>;
  onUpdatePillar: (pillar: SaltPillar) => Promise<void>;
  onDeletePillar: (pillarId: string) => Promise<void>;
  onScheduleJob: (job: SaltJob) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '20px 0' }}>
    {value === index && children}
  </div>
);

const SaltManagement: React.FC<SaltManagementProps> = ({
  devices,
  states,
  pillars,
  jobs,
  onAddState,
  onUpdateState,
  onDeleteState,
  onAddPillar,
  onUpdatePillar,
  onDeletePillar,
  onScheduleJob,
  onRefreshData,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [openStateDialog, setOpenStateDialog] = useState(false);
  const [openPillarDialog, setOpenPillarDialog] = useState(false);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [selectedState, setSelectedState] = useState<SaltState | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<SaltPillar | null>(null);
  const [activeStep, setActiveStep] = useState(0);

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

  const renderDecentralizationMetrics = (state: SaltState) => {
    const { decentralization } = state.metadata;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Decentralization Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Node Count
              </Typography>
              <Typography variant="h6">
                {decentralization.nodeCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Geographic Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(decentralization.geographicDistribution).map(([region, count]) => (
                  <Chip
                    key={region}
                    label={`${region}: ${count}`}
                    size="small"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Stake Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(decentralization.stakeDistribution).map(([tier, amount]) => (
                  <Chip
                    key={tier}
                    label={`${tier}: ${amount}`}
                    size="small"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Verification Type</InputLabel>
                <Select
                  value={selectedState?.verification[0]?.type || 'check'}
                  onChange={(e) => setSelectedState({
                    ...selectedState!,
                    verification: [{
                      ...selectedState!.verification[0],
                      type: e.target.value as SaltState['verification'][0]['type'],
                    }],
                  })}
                >
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="test">Test</MenuItem>
                  <MenuItem value="validation">Validation</MenuItem>
                  <MenuItem value="consensus">Consensus</MenuItem>
                </Select>
              </FormControl>
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
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              <SettingsIcon sx={{ mr: 1 }} />
              Salt Management
            </Typography>
            <Box>
              <IconButton onClick={onRefreshData} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
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

          <TabPanel value={tabValue} index={0}>
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
                        <IconButton onClick={() => onDeleteState(state.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
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
                        <IconButton onClick={() => onDeletePillar(pillar.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
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
          </TabPanel>
        </CardContent>
      </Card>

      {/* State Dialog */}
      <Dialog open={openStateDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedState ? 'Edit State' : 'Add New State'}
        </DialogTitle>
        <DialogContent>
          {renderStateDialogContent()}
          {selectedState && renderDecentralizationMetrics(selectedState)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              if (activeStep === 2) {
                handleCloseDialog();
                if (selectedState) {
                  if (selectedState.id) {
                    onUpdateState(selectedState);
                  } else {
                    onAddState(selectedState);
                  }
                }
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
          <Button
            onClick={() => {
              handleCloseDialog();
              if (selectedPillar) {
                if (selectedPillar.id) {
                  onUpdatePillar(selectedPillar);
                } else {
                  onAddPillar(selectedPillar);
                }
              }
            }}
            variant="contained"
            color="primary"
          >
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