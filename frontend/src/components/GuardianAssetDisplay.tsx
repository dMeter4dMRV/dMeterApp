import React from 'react';
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
} from '@mui/material';
import {
  Verified,
  Warning,
  CheckCircle,
  Error,
  Token,
  Description,
} from '@mui/icons-material';
import { GuardianAsset, GuardianPolicy } from '../utils/guardianIntegration';

interface GuardianAssetDisplayProps {
  asset: GuardianAsset;
  policy: GuardianPolicy;
  onVerify?: () => void;
}

const GuardianAssetDisplay: React.FC<GuardianAssetDisplayProps> = ({
  asset,
  policy,
  onVerify,
}) => {
  const renderVerificationStatus = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Chip
        icon={<Verified />}
        label="Guardian Verified"
        color="success"
        variant="outlined"
      />
      <Chip
        icon={<Token />}
        label="SEI Tokenized"
        color="primary"
        variant="outlined"
      />
    </Box>
  );

  const renderMetrics = () => (
    <Grid container spacing={2}>
      {Object.entries(asset.metrics).map(([key, value]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                {key}
              </Typography>
              <Typography variant="h6">{value.toFixed(2)}</Typography>
              <Chip
                label={`${Math.round(asset.verification.confidence * 100)}% confidence`}
                color={asset.verification.confidence >= 0.7 ? 'success' : 'warning'}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderPolicyRules = () => (
    <List>
      {Object.entries(policy.rules).map(([key, rule]) => (
        <React.Fragment key={key}>
          <ListItem>
            <ListItemIcon>
              {rule.required ? <CheckCircle color="success" /> : <Warning color="warning" />}
            </ListItemIcon>
            <ListItemText
              primary={key.charAt(0).toUpperCase() + key.slice(1)}
              secondary={`Required: ${rule.required ? 'Yes' : 'No'}`}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );

  const renderSeiToken = () => (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          SEI Token
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {asset.seiToken.address}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body1">
              {asset.seiToken.amount / Math.pow(10, asset.seiToken.decimals)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <List>
      {asset.metadata.documents.map((doc, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary={doc} />
          </ListItem>
          {index < asset.metadata.documents.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {asset.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {asset.description}
          </Typography>
          {renderVerificationStatus()}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1">
              Lat: {asset.location.lat}, Lng: {asset.location.lng}, Area: {asset.location.area} ha
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Metrics
            </Typography>
            {renderMetrics()}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Policy Rules
            </Typography>
            {renderPolicyRules()}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              SEI Token Details
            </Typography>
            {renderSeiToken()}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            {renderDocuments()}
          </Box>

          {onVerify && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Verified />}
                onClick={onVerify}
              >
                Verify Asset
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default GuardianAssetDisplay; 