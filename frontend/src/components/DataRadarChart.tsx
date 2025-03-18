import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import * as d3 from 'd3';

interface DataRadarChartProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataRadarChart: React.FC<DataRadarChartProps> = ({
  data,
  loading = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 800;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Group data by location and calculate average values for each data type
    const groupedData = d3.group(data, (d) => d.location);
    const locations = Array.from(groupedData.keys());
    const dataTypes = Array.from(new Set(data.map((d) => d.dataType)));

    const radarData = locations.map((location) => {
      const locationData = groupedData.get(location) || [];
      const averages = dataTypes.map((type) => {
        const typeData = locationData.filter((d) => d.dataType === type);
        return {
          type,
          value: d3.mean(typeData, (d) => d.value) || 0,
        };
      });
      return {
        location,
        values: averages,
      };
    });

    // Create scales
    const angleSlice = (Math.PI * 2) / dataTypes.length;
    const rScale = d3
      .scaleLinear()
      .range([0, radius])
      .domain([
        0,
        d3.max(
          radarData.flatMap((d) => d.values),
          (v) => v.value
        ) || 0,
      ]);

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(locations)
      .range(d3.schemeCategory10);

    // Create radar chart
    const radarLine = d3
      .lineRadial<{ type: string; value: number }>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Add circular grid
    const levels = 5;
    const gridCircles = svg
      .selectAll('.gridCircle')
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => (radius / levels) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', 0.1);

    // Add axes
    const axes = svg
      .selectAll('.axis')
      .data(dataTypes)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(rScale.domain()[1]) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(rScale.domain()[1]) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    axes
      .append('text')
      .attr('class', 'legend')
      .style('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(rScale.domain()[1]) * 1.1 * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(rScale.domain()[1]) * 1.1 * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d);

    // Add data lines
    const radarLines = svg
      .selectAll('.radarLine')
      .data(radarData)
      .enter()
      .append('path')
      .attr('class', 'radarLine')
      .attr('d', (d) => radarLine(d.values))
      .style('fill', (d) => colorScale(d.location))
      .style('fill-opacity', 0.3)
      .style('stroke', (d) => colorScale(d.location))
      .style('stroke-width', '2px');

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${radius + 60}, -${radius / 2})`);

    locations.forEach((location, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(location));

      legendRow
        .append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(location);
    });
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading radar chart...</Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="textSecondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <svg ref={svgRef}></svg>
    </Paper>
  );
}; 