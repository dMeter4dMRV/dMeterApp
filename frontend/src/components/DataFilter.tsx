import React from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DataFilterProps {
  onFilterChange: (filters: {
    startDate?: Date;
    endDate?: Date;
    location?: string;
    dataType?: string;
  }) => void;
  locations: string[];
  dataTypes: string[];
}

export const DataFilter: React.FC<DataFilterProps> = ({
  onFilterChange,
  locations,
  dataTypes,
}) => {
  const [filters, setFilters] = React.useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    location: '',
    dataType: '',
  });

  const handleChange = (field: keyof typeof filters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange({
      startDate: newFilters.startDate || undefined,
      endDate: newFilters.endDate || undefined,
      location: newFilters.location || undefined,
      dataType: newFilters.dataType || undefined,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleChange('startDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleChange('endDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location}
                label="Location"
                onChange={(e) => handleChange('location', e.target.value)}
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={filters.dataType}
                label="Data Type"
                onChange={(e) => handleChange('dataType', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {dataTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}; 