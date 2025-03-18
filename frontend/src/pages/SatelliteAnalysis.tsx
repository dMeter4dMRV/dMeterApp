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
  Slider,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { SatelliteAnalysisConfig, SatelliteAnalysisResult } from '../utils/satelliteAnalysis';
import SatelliteAnalysisDisplay from '../components/SatelliteAnalysisDisplay';

const SatelliteAnalysis: React.FC = () => {
  const [config, setConfig] = useState<SatelliteAnalysisConfig>({
    modelType: 'classification',
    dataSource: 'sentinel-2',
    bands: ['B2', 'B3', 'B4', 'B8'],
    resolution: 10,
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
    preprocessing: {
      cloudRemoval: true,
      atmosphericCorrection: true,
      normalization: true,
    },
    postprocessing: {
      confidenceThreshold: 0.8,
      smoothing: true,
      edgeDetection: true,
    },
    healthDeterminants: {
      temperature: true,
      precipitation: true,
      airQuality: true,
      vegetation: true,
      waterBodies: true,
      urbanDensity: true,
    },
    ecosystemServices: {
      provisioning: true,
      regulating: true,
      cultural: true,
      supporting: true,
    },
    vulnerabilityAssessment: {
      populationDensity: true,
      environmentalExposure: true,
      healthInfrastructure: true,
      socioEconomicFactors: true,
    },
    deepLearning: {
      modelType: 'classification',
      backbone: 'resnet50',
      pretrained: true,
      inputChannels: 4,
      outputChannels: 1,
      chipSize: 256,
      stride: 128,
      batchSize: 32,
      epochs: 100,
      learningRate: 0.001,
      optimizer: 'adam',
      lossFunction: 'binary_crossentropy',
      augmentation: {
        flip: true,
        rotate: true,
        scale: true,
        brightness: true,
        contrast: true,
      },
      validationSplit: 0.2,
      earlyStopping: {
        patience: 10,
        minDelta: 0.001,
      },
    },
    dataPreparation: {
      chipSize: 256,
      stride: 128,
      overlap: 0.5,
      minChipSize: 128,
      maxChipSize: 512,
      chipFormat: 'png',
      chipCompression: 9,
    },
    training: {
      dataAugmentation: true,
      validationSplit: 0.2,
      crossValidation: true,
      kFolds: 5,
      classBalancing: true,
      sampleWeights: true,
    },
    inference: {
      batchSize: 32,
      confidenceThreshold: 0.8,
      nmsThreshold: 0.5,
      maxDetections: 100,
      postProcessing: true,
    },
  });

  const [result, setResult] = useState<SatelliteAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfigChange = (path: string, value: any) => {
    const pathArray = path.split('.');
    let current: any = config;
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;
    setConfig({ ...config });
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // TODO: Implement actual API call
      setResult({
        id: 'test-result',
        timestamp: Date.now(),
        config,
        location: {
          lat: 0,
          lng: 0,
          area: 1000,
        },
        metrics: {
          vegetationIndex: 0.75,
          builtUpIndex: 0.25,
          waterIndex: 0.1,
          soilIndex: 0.4,
          temperatureIndex: 0.65,
          precipitationIndex: 0.45,
          airQualityIndex: 0.8,
          biodiversityIndex: 0.7,
          ecosystemHealthIndex: 0.6,
          vulnerabilityIndex: 0.3,
        },
        confidence: 0.85,
        quality: {
          cloudCover: 0.1,
          resolution: 10,
          coverage: 0.95,
          temporalConsistency: 0.9,
          spatialAccuracy: 0.85,
          dataCompleteness: 0.95,
        },
        classifications: {
          forest: {
            percentage: 0.4,
            confidence: 0.9,
            area: 1000,
          },
          urban: {
            percentage: 0.3,
            confidence: 0.85,
            area: 750,
          },
          water: {
            percentage: 0.2,
            confidence: 0.95,
            area: 500,
          },
          agricultural: {
            percentage: 0.15,
            confidence: 0.88,
            area: 375,
          },
          wetlands: {
            percentage: 0.1,
            confidence: 0.92,
            area: 250,
          },
          other: {
            percentage: 0.05,
            confidence: 0.8,
            area: 125,
          },
        },
        changes: {
          vegetation: {
            before: 0.4,
            after: 0.35,
            difference: -0.05,
            confidence: 0.9,
          },
          builtUp: {
            before: 0.3,
            after: 0.35,
            difference: 0.05,
            confidence: 0.85,
          },
          waterBodies: {
            before: 0.2,
            after: 0.18,
            difference: -0.02,
            confidence: 0.88,
          },
          greenSpace: {
            before: 0.25,
            after: 0.22,
            difference: -0.03,
            confidence: 0.87,
          },
          airQuality: {
            before: 0.8,
            after: 0.75,
            difference: -0.05,
            confidence: 0.86,
          },
        },
        objects: [
          {
            type: 'building',
            count: 150,
            area: 75000,
            confidence: 0.9,
            locations: [
              {
                lat: 0,
                lng: 0,
                size: 500,
              },
            ],
          },
          {
            type: 'waterbody',
            count: 5,
            area: 25000,
            confidence: 0.95,
            locations: [
              {
                lat: 0,
                lng: 0,
                size: 5000,
              },
            ],
          },
        ],
        healthDeterminants: {
          temperature: {
            mean: 20,
            range: 10,
            trend: 0.5,
          },
          precipitation: {
            total: 1000,
            frequency: 0.5,
            intensity: 0.25,
          },
          airQuality: {
            aqi: 50,
            pollutants: {
              CO2: 400,
              'PM2.5': 10,
              NO2: 20,
            },
          },
          vegetation: {
            ndvi: 0.7,
            biomass: 1000,
            health: 0.8,
          },
          waterBodies: {
            coverage: 0.9,
            quality: 0.8,
            accessibility: 0.7,
          },
          urbanDensity: {
            builtUp: 0.5,
            greenSpace: 0.3,
            connectivity: 0.4,
          },
        },
        ecosystemServices: {
          provisioning: {
            food: 0.7,
            water: 0.8,
            rawMaterials: 0.6,
          },
          regulating: {
            airQuality: 0.8,
            climate: 0.7,
            water: 0.9,
            disease: 0.5,
          },
          cultural: {
            recreation: 0.6,
            aesthetic: 0.7,
            spiritual: 0.5,
          },
          supporting: {
            biodiversity: 0.7,
            soilFormation: 0.8,
            nutrientCycling: 0.6,
          },
        },
        vulnerabilityAssessment: {
          populationDensity: 0.5,
          environmentalExposure: 0.6,
          healthInfrastructure: 0.7,
          socioEconomicFactors: 0.4,
          overallVulnerability: 0.5,
        },
        verification: {
          verifiers: [],
          consensus: {
            totalStake: 0,
            averageConfidence: 0,
            minimumStake: 1000,
            requiredVerifiers: 5,
            status: 'pending',
            timestamp: Date.now(),
          },
          verificationMethod: 'proof-of-consensus',
          verificationPeriod: 24 * 60 * 60 * 1000,
          challengePeriod: 7 * 24 * 60 * 60 * 1000,
          rewards: {
            total: 0,
            distribution: {},
          },
        },
        metadata: {
          processingTime: 0,
          modelVersion: '1.0.0',
          algorithm: 'classification',
          parameters: config,
          decentralization: {
            nodeCount: 0,
            geographicDistribution: {},
            stakeDistribution: {},
            consensusReached: false,
          },
        },
      });
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Satellite Analysis</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Results">
            <IconButton sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={loading ? <StopIcon /> : <PlayArrowIcon />}
            onClick={handleRunAnalysis}
            disabled={loading}
          >
            {loading ? 'Stop Analysis' : 'Run Analysis'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Configuration</Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Model Type</InputLabel>
                <Select
                  value={config.modelType}
                  onChange={(e) => handleConfigChange('modelType', e.target.value)}
                >
                  <MenuItem value="classification">Classification</MenuItem>
                  <MenuItem value="segmentation">Segmentation</MenuItem>
                  <MenuItem value="object-detection">Object Detection</MenuItem>
                  <MenuItem value="change-detection">Change Detection</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Data Source</InputLabel>
                <Select
                  value={config.dataSource}
                  onChange={(e) => handleConfigChange('dataSource', e.target.value)}
                >
                  <MenuItem value="sentinel-2">Sentinel-2</MenuItem>
                  <MenuItem value="landsat-8">Landsat-8</MenuItem>
                  <MenuItem value="modis">MODIS</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>

              <Typography gutterBottom>Confidence Threshold</Typography>
              <Slider
                value={config.postprocessing.confidenceThreshold}
                onChange={(_, value) => handleConfigChange('postprocessing.confidenceThreshold', value)}
                min={0}
                max={1}
                step={0.1}
                marks
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.preprocessing.cloudRemoval}
                    onChange={(e) => handleConfigChange('preprocessing.cloudRemoval', e.target.checked)}
                  />
                }
                label="Cloud Removal"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.preprocessing.atmosphericCorrection}
                    onChange={(e) => handleConfigChange('preprocessing.atmosphericCorrection', e.target.checked)}
                  />
                }
                label="Atmospheric Correction"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={config.preprocessing.normalization}
                    onChange={(e) => handleConfigChange('preprocessing.normalization', e.target.checked)}
                  />
                }
                label="Normalization"
                sx={{ mb: 1 }}
              />

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Health Determinants</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(config.healthDeterminants).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={key}
                      color={value ? 'primary' : 'default'}
                      onClick={() => handleConfigChange(`healthDeterminants.${key}`, !value)}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {result ? (
            <SatelliteAnalysisDisplay result={result} />
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" color="textSecondary">
                  Run analysis to see results
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SatelliteAnalysis; 