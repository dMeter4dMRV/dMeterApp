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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { GuardianAsset } from '../utils/satelliteAnalysis';

const EnvironmentalAssets: React.FC = () => {
  const [assets, setAssets] = useState<GuardianAsset[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<GuardianAsset | null>(null);

  const handleOpenDialog = (asset?: GuardianAsset) => {
    setSelectedAsset(asset || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
  };

  const handleSaveAsset = () => {
    if (selectedAsset) {
      if (selectedAsset.id) {
        // Update existing asset
        setAssets(assets.map(a => a.id === selectedAsset.id ? selectedAsset : a));
      } else {
        // Add new asset
        setAssets([...assets, { ...selectedAsset, id: `asset-${Date.now()}` }]);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter(a => a.id !== assetId));
  };

  const renderAssetStatus = (asset: GuardianAsset) => {
    const status = asset.verification.confidence >= 0.8 ? 'Verified' : 'Pending';
    return (
      <Chip
        label={status}
        color={status === 'Verified' ? 'success' : 'warning'}
        size="small"
      />
    );
  };

  const renderAssetDialog = () => (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedAsset ? 'Edit Asset' : 'Add New Asset'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={selectedAsset?.name || ''}
              onChange={(e) => setSelectedAsset({ ...selectedAsset!, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={selectedAsset?.description || ''}
              onChange={(e) => setSelectedAsset({ ...selectedAsset!, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedAsset?.type || 'biodiversity'}
                onChange={(e) => setSelectedAsset({ ...selectedAsset!, type: e.target.value as GuardianAsset['type'] })}
              >
                <MenuItem value="biodiversity">Biodiversity</MenuItem>
                <MenuItem value="water">Water</MenuItem>
                <MenuItem value="ecosystem">Ecosystem</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Confidence"
              value={selectedAsset?.verification.confidence || 0}
              onChange={(e) => setSelectedAsset({
                ...selectedAsset!,
                verification: {
                  ...selectedAsset!.verification,
                  confidence: parseFloat(e.target.value),
                },
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Location
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Latitude"
                  value={selectedAsset?.location.lat || 0}
                  onChange={(e) => setSelectedAsset({
                    ...selectedAsset!,
                    location: {
                      ...selectedAsset!.location,
                      lat: parseFloat(e.target.value),
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Longitude"
                  value={selectedAsset?.location.lng || 0}
                  onChange={(e) => setSelectedAsset({
                    ...selectedAsset!,
                    location: {
                      ...selectedAsset!.location,
                      lng: parseFloat(e.target.value),
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Area (m²)"
                  value={selectedAsset?.location.area || 0}
                  onChange={(e) => setSelectedAsset({
                    ...selectedAsset!,
                    location: {
                      ...selectedAsset!.location,
                      area: parseFloat(e.target.value),
                    },
                  })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Metrics
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(selectedAsset?.metrics || {}).map(([key, value]) => (
                <Grid item xs={12} md={6} key={key}>
                  <TextField
                    fullWidth
                    type="number"
                    label={key}
                    value={value}
                    onChange={(e) => setSelectedAsset({
                      ...selectedAsset!,
                      metrics: {
                        ...selectedAsset!.metrics,
                        [key]: parseFloat(e.target.value),
                      },
                    })}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSaveAsset} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Environmental Assets</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Report">
            <IconButton sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Asset
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Confidence</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>
                          {asset.location.lat.toFixed(4)}, {asset.location.lng.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          {(asset.verification.confidence * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>{renderAssetStatus(asset)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog(asset)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteAsset(asset.id)}>
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
        </Grid>
      </Grid>

      {renderAssetDialog()}
    </Box>
  );
};

export default EnvironmentalAssets; 