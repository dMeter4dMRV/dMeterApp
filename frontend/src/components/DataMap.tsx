import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DataMapProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export const DataMap: React.FC<DataMapProps> = ({ data, loading = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    data.forEach((point) => {
      // In a real application, you would convert location to coordinates
      // This is a simplified example
      const coordinates = [0, 0]; // Replace with actual coordinates
      const marker = L.marker(coordinates as L.LatLngExpression)
        .bindPopup(
          `<strong>${point.dataType}</strong><br/>
           Value: ${point.value}<br/>
           Location: ${point.location}<br/>
           Time: ${new Date(point.timestamp).toLocaleString()}`
        )
        .addTo(mapInstance.current!);
      markersRef.current.push(marker);
    });

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
    };
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '500px' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </Paper>
  );
}; 