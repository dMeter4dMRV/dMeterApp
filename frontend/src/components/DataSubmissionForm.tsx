import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Grid,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Divider,
} from '@mui/material';
import { useEnvironmentalData } from '../hooks/useEnvironmentalData';
import { EnvironmentalData } from '../utils/api';
import { DataSource, SATELLITE_SOURCES, IOT_SOURCES, HUMAN_SOURCES, verifyData } from '../utils/dataSources';

const DATA_TYPES = [
  'Temperature',
  'Humidity',
  'Air Quality',
  'Water Quality',
  'Soil Quality',
  'Noise Level',
  'Light Level',
  'Pressure',
];

const UNITS = {
  Temperature: '°C',
  Humidity: '%',
  'Air Quality': 'AQI',
  'Water Quality': 'pH',
  'Soil Quality': 'pH',
  'Noise Level': 'dB',
  'Light Level': 'lux',
  Pressure: 'hPa',
};

const REWARD_RATES = {
  Temperature: 10,
  Humidity: 10,
  'Air Quality': 15,
  'Water Quality': 20,
  'Soil Quality': 20,
  'Noise Level': 10,
  'Light Level': 10,
  Pressure: 10,
};

const REWARD_MULTIPLIERS = {
  satellite: 1.5,
  iot: 1.2,
  human: 1.0,
  community: 1.3,
};

const REGULATORY_STANDARDS = {
  'ISO 14001': 'Environmental Management',
  'ISO 27001': 'Information Security',
  'GDPR': 'Data Protection',
  'EPA': 'Environmental Protection',
};

const ECOSYSTEM_SERVICE_CATEGORIES = {
  provisioning: 'Provisioning Services',
  regulating: 'Regulating Services',
  cultural: 'Cultural Services',
  supporting: 'Supporting Services',
};

const VALUATION_METHODS = {
  'market-based': 'Market-Based Valuation',
  'stated preference': 'Stated Preference',
  'revealed preference': 'Revealed Preference',
  'replacement cost': 'Replacement Cost',
  'benefit transfer': 'Benefit Transfer',
};

export const DataSubmissionForm: React.FC = () => {
  const { submitData, loading, error } = useEnvironmentalData();
  const [formData, setFormData] = useState<Omit<EnvironmentalData, 'id' | 'timestamp'>>({
    value: 0,
    location: '',
    dataType: '',
    unit: '',
    source: '',
  });
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value,
      unit: name === 'dataType' ? UNITS[value as keyof typeof UNITS] : prev.unit,
    }));
  };

  const handleSourceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const sourceName = event.target.value as string;
    const source = [...SATELLITE_SOURCES, ...IOT_SOURCES, ...HUMAN_SOURCES].find(
      (s) => s.name === sourceName
    );
    setSelectedSource(source || null);
    setFormData((prev) => ({
      ...prev,
      source: sourceName,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSource) {
      return;
    }

    try {
      setVerifying(true);
      setVerificationProgress(0);

      // Simulate verification progress
      const progressInterval = setInterval(() => {
        setVerificationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      const verification = await verifyData(formData, selectedSource);
      clearInterval(progressInterval);

      await submitData({
        ...formData,
        verification: verification,
      });

      setFormData({
        value: 0,
        location: '',
        dataType: '',
        unit: '',
        source: '',
      });
      setSelectedSource(null);
    } catch (err) {
      console.error('Error submitting data:', err);
    } finally {
      setVerifying(false);
      setVerificationProgress(0);
    }
  };

  const calculatePotentialReward = () => {
    if (!formData.dataType || !selectedSource) return 0;
    const baseReward = REWARD_RATES[formData.dataType as keyof typeof REWARD_RATES] || 0;
    const sourceMultiplier = REWARD_MULTIPLIERS[selectedSource.type];
    const trustScore = selectedSource.trustScore;
    const qualityScore = selectedSource.dataQuality
      ? (selectedSource.dataQuality.accuracy + selectedSource.dataQuality.precision + selectedSource.dataQuality.reliability) / 3
      : 1;
    
    return Math.round(baseReward * sourceMultiplier * trustScore * qualityScore);
  };

  const renderSourceDetails = () => {
    if (!selectedSource) return null;

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Source Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="textSecondary">
                  Trust Score:
                </Typography>
                <Chip
                  label={`${(selectedSource.trustScore * 100).toFixed(0)}%`}
                  color={selectedSource.trustScore > 0.8 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="textSecondary">
                  Update Frequency:
                </Typography>
                <Chip
                  label={selectedSource.updateFrequency || 'Unknown'}
                  color="info"
                  size="small"
                />
              </Box>
            </Grid>
            {selectedSource.dataQuality && (
              <>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="textSecondary">
                      Accuracy:
                    </Typography>
                    <Chip
                      label={`${(selectedSource.dataQuality.accuracy * 100).toFixed(0)}%`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="textSecondary">
                      Precision:
                    </Typography>
                    <Chip
                      label={`${(selectedSource.dataQuality.precision * 100).toFixed(0)}%`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="textSecondary">
                      Reliability:
                    </Typography>
                    <Chip
                      label={`${(selectedSource.dataQuality.reliability * 100).toFixed(0)}%`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" color="textSecondary">
                  Verification Method:
                </Typography>
                <Chip
                  label={selectedSource.verificationMethod}
                  color="info"
                  size="small"
                />
              </Box>
            </Grid>
            {selectedSource.calibrationRequired && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  This source requires periodic calibration for accurate measurements
                </Alert>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    );
  };

  const renderDecentralizationInfo = () => {
    if (!selectedSource?.decentralization) return null;

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Decentralization Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Network Size:
              </Typography>
              <Typography variant="body2">
                {selectedSource.decentralization.nodeCount.toLocaleString()} nodes
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Active Validators:
              </Typography>
              <Typography variant="body2">
                {selectedSource.decentralization.activeValidators} / {selectedSource.decentralization.validatorCount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Network Health:
              </Typography>
              <Chip
                label={`${(selectedSource.decentralization.networkHealth * 100).toFixed(0)}%`}
                color={selectedSource.decentralization.networkHealth > 0.9 ? 'success' : 'warning'}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Decentralization Score:
              </Typography>
              <Chip
                label={`${(selectedSource.decentralization.decentralizationScore * 100).toFixed(0)}%`}
                color={selectedSource.decentralization.decentralizationScore > 0.9 ? 'success' : 'warning'}
                size="small"
              />
            </Grid>
            {selectedSource.decentralization.consensusRequired && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Consensus Threshold:
                  </Typography>
                  <Typography variant="body2">
                    {(selectedSource.decentralization.consensusThreshold * 100).toFixed(0)}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Community Governance:
                  </Typography>
                  <Chip
                    label={selectedSource.decentralization.communityGovernance ? 'Enabled' : 'Disabled'}
                    color={selectedSource.decentralization.communityGovernance ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
              </>
            )}
            {selectedSource.decentralization.stakingRequired && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Minimum Stake:
                  </Typography>
                  <Typography variant="body2">
                    {selectedSource.decentralization.minStakeAmount} DMT
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Slashing Enabled:
                  </Typography>
                  <Chip
                    label={selectedSource.decentralization.slashingEnabled ? 'Yes' : 'No'}
                    color={selectedSource.decentralization.slashingEnabled ? 'warning' : 'default'}
                    size="small"
                  />
                </Grid>
                {selectedSource.decentralization.slashingEnabled && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Slashing Threshold:
                    </Typography>
                    <Typography variant="body2">
                      {(selectedSource.decentralization.slashingThreshold * 100).toFixed(0)}%
                    </Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Paper>
      </Grid>
    );
  };

  const renderEngagementInfo = () => {
    if (!selectedSource?.engagement) return null;

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Community Engagement
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Active Contributors:
              </Typography>
              <Typography variant="body2">
                {selectedSource.engagement.activeContributors} / {selectedSource.engagement.contributorCount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Total Validations:
              </Typography>
              <Typography variant="body2">
                {selectedSource.engagement.validationCount.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Community Score:
              </Typography>
              <Chip
                label={`${(selectedSource.engagement.communityScore * 100).toFixed(0)}%`}
                color="success"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Reputation Multiplier:
              </Typography>
              <Chip
                label={`x${selectedSource.engagement.reputationMultiplier.toFixed(2)}`}
                color="primary"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Community Roles:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label={`${selectedSource.engagement.communityRoles.validators} Validators`}
                  color="info"
                  size="small"
                />
                <Chip
                  label={`${selectedSource.engagement.communityRoles.dataProviders} Data Providers`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`${selectedSource.engagement.communityRoles.reviewers} Reviewers`}
                  color="warning"
                  size="small"
                />
                <Chip
                  label={`${selectedSource.engagement.communityRoles.developers} Developers`}
                  color="error"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Contribution History:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label={`${selectedSource.engagement.contributionHistory.lastMonth} Last Month`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`${selectedSource.engagement.contributionHistory.lastQuarter} Last Quarter`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`${selectedSource.engagement.contributionHistory.lastYear} Last Year`}
                  color="primary"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Governance Participation:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label={`${selectedSource.engagement.governanceParticipation.proposalsSubmitted} Proposals`}
                  color="secondary"
                  size="small"
                />
                <Chip
                  label={`${selectedSource.engagement.governanceParticipation.proposalsPassed} Passed`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`${(selectedSource.engagement.governanceParticipation.votingPower * 100).toFixed(0)}% Voting Power`}
                  color="info"
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  };

  const renderRegulatoryCompliance = () => {
    if (!selectedSource?.regulatoryCompliance) return null;

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Regulatory Compliance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Standards:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedSource.regulatoryCompliance.standards.map((standard) => (
                  <Chip
                    key={standard}
                    label={`${standard} - ${REGULATORY_STANDARDS[standard as keyof typeof REGULATORY_STANDARDS] || 'Unknown'}`}
                    color="success"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Last Audit:
              </Typography>
              <Typography variant="body2">
                {new Date(selectedSource.regulatoryCompliance.lastAudit).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Next Audit Due:
              </Typography>
              <Typography variant="body2">
                {new Date(selectedSource.regulatoryCompliance.nextAuditDue).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  };

  const renderPeerReview = () => {
    if (!selectedSource?.peerReview) return null;

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Peer Review Requirements
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Minimum Reviewers:
              </Typography>
              <Typography variant="body2">
                {selectedSource.peerReview.minReviewers}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Review Timeframe:
              </Typography>
              <Typography variant="body2">
                {selectedSource.peerReview.reviewTimeframe}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Review Criteria:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedSource.peerReview.criteria.map((criterion) => (
                  <Chip
                    key={criterion}
                    label={criterion}
                    color="info"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  };

  const renderEcosystemServices = () => {
    if (!selectedSource?.ecosystemServices) return null;

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Ecosystem Services
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Total Value:
              </Typography>
              <Typography variant="body2">
                ${selectedSource.ecosystemServices.totalValue.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Valuation Method:
              </Typography>
              <Chip
                label={VALUATION_METHODS[selectedSource.ecosystemServices.valuationMethod as keyof typeof VALUATION_METHODS]}
                color="info"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Spatial Coverage:
              </Typography>
              <Chip
                label={`${(selectedSource.ecosystemServices.spatialCoverage * 100).toFixed(0)}%`}
                color="primary"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Temporal Coverage:
              </Typography>
              <Chip
                label={`${(selectedSource.ecosystemServices.temporalCoverage * 100).toFixed(0)}%`}
                color="primary"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Quality Metrics:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label={`Accuracy: ${(selectedSource.ecosystemServices.qualityMetrics.accuracy * 100).toFixed(0)}%`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`Precision: ${(selectedSource.ecosystemServices.qualityMetrics.precision * 100).toFixed(0)}%`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`Reliability: ${(selectedSource.ecosystemServices.qualityMetrics.reliability * 100).toFixed(0)}%`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`Completeness: ${(selectedSource.ecosystemServices.qualityMetrics.completeness * 100).toFixed(0)}%`}
                  color="success"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Services by Category:
              </Typography>
              {Object.entries(ECOSYSTEM_SERVICE_CATEGORIES).map(([category, label]) => {
                const services = selectedSource.ecosystemServices.services.filter(
                  (s) => s.category === category
                );
                if (services.length === 0) return null;

                return (
                  <Box key={category} mb={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {label}:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {services.map((service) => (
                        <Chip
                          key={service.name}
                          label={`${service.name} (${service.unit})`}
                          color="info"
                          size="small"
                          title={`Confidence: ${(service.confidence * 100).toFixed(0)}%`}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Assessment Timeline:
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">
                  Last: {new Date(selectedSource.ecosystemServices.lastAssessment).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">•</Typography>
                <Typography variant="body2">
                  Next: {new Date(selectedSource.ecosystemServices.nextAssessmentDue).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  };

  const renderRewardBreakdown = () => {
    if (!formData.dataType || !selectedSource) return null;

    const baseReward = REWARD_RATES[formData.dataType as keyof typeof REWARD_RATES] || 0;
    const sourceMultiplier = REWARD_MULTIPLIERS[selectedSource.type];
    const trustScore = selectedSource.trustScore;
    const qualityScore = selectedSource.dataQuality
      ? (selectedSource.dataQuality.accuracy + selectedSource.dataQuality.precision + selectedSource.dataQuality.reliability) / 3
      : 1;
    
    let finalReward = baseReward * sourceMultiplier * trustScore * qualityScore;

    // Apply decentralization bonus
    if (selectedSource.decentralization?.consensusRequired) {
      const consensusStrength = selectedSource.decentralization.nodeCount / 1000;
      finalReward *= (1 + consensusStrength * 0.05);
    }

    // Apply engagement bonus
    if (selectedSource.engagement) {
      const { communityScore, reputationMultiplier } = selectedSource.engagement;
      finalReward *= (1 + communityScore * 0.1) * reputationMultiplier;
    }

    // Apply regulatory compliance bonus
    if (selectedSource.regulatoryCompliance) {
      finalReward *= 1.1;
    }

    // Apply peer review bonus
    if (selectedSource.peerReview) {
      finalReward *= 1.085;
    }

    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom>
            Reward Breakdown
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Base Reward:</Typography>
                <Typography variant="body2">{baseReward} DMT</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Source Type Multiplier:</Typography>
                <Typography variant="body2">x{sourceMultiplier}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Trust Score:</Typography>
                <Typography variant="body2">x{trustScore.toFixed(2)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Quality Score:</Typography>
                <Typography variant="body2">x{qualityScore.toFixed(2)}</Typography>
              </Box>
            </Grid>
            {selectedSource.decentralization?.consensusRequired && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Decentralization Bonus:</Typography>
                  <Typography variant="body2">
                    x{(1 + (selectedSource.decentralization.nodeCount / 1000) * 0.05).toFixed(3)}
                  </Typography>
                </Box>
              </Grid>
            )}
            {selectedSource.engagement && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Community Engagement Bonus:</Typography>
                  <Typography variant="body2">
                    x{(1 + selectedSource.engagement.communityScore * 0.1).toFixed(3)}
                  </Typography>
                </Box>
              </Grid>
            )}
            {selectedSource.regulatoryCompliance && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Regulatory Compliance Bonus:</Typography>
                  <Typography variant="body2">x1.1</Typography>
                </Box>
              </Grid>
            )}
            {selectedSource.peerReview && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Peer Review Bonus:</Typography>
                  <Typography variant="body2">x1.085</Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle2">Final Reward:</Typography>
                <Typography variant="subtitle2" color="primary">
                  {Math.round(finalReward)} DMT
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit Environmental Data
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Data Type"
              name="dataType"
              value={formData.dataType}
              onChange={handleChange}
              required
            >
              {DATA_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: formData.unit && <span>{formData.unit}</span>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Data Source</InputLabel>
              <Select
                value={formData.source}
                onChange={handleSourceChange}
                label="Data Source"
              >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                  Satellite Sources
                </Typography>
                {SATELLITE_SOURCES.map((source) => (
                  <MenuItem key={source.name} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
                <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                  IoT Sources
                </Typography>
                {IOT_SOURCES.map((source) => (
                  <MenuItem key={source.name} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
                <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                  Human Sources
                </Typography>
                {HUMAN_SOURCES.map((source) => (
                  <MenuItem key={source.name} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {renderSourceDetails()}
          {renderDecentralizationInfo()}
          {renderEngagementInfo()}
          {renderRegulatoryCompliance()}
          {renderPeerReview()}
          {renderEcosystemServices()}
          {renderRewardBreakdown()}

          {verifying && (
            <Grid item xs={12}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress variant="determinate" value={verificationProgress} />
                <Typography variant="body2" color="textSecondary" align="center">
                  Verifying data... {verificationProgress}%
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || verifying || !selectedSource}
              >
                {loading ? 'Submitting...' : verifying ? 'Verifying...' : 'Submit Data'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}; 