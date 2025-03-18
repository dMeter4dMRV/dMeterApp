import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import * as d3 from 'd3';

interface DataLineChartProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataLineChart: React.FC<DataLineChartProps> = ({
  data,
  loading = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(sortedData, (d) => d.timestamp) as [number, number])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.value) || 0])
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line<EnvironmentalData>()
      .x((d) => xScale(d.timestamp))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('fill', 'currentColor')
      .text('Time');

    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('x', -height / 2)
      .attr('fill', 'currentColor')
      .text('Value');

    // Add the line path
    svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#1976d2')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots for data points
    svg
      .selectAll('circle')
      .data(sortedData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.timestamp))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#1976d2')
      .append('title')
      .text(
        (d) =>
          `Value: ${d.value}\nTime: ${new Date(d.timestamp).toLocaleString()}\nLocation: ${d.location}`
      );
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading line chart...</Typography>
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