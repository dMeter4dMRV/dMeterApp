import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import * as d3 from 'd3';

interface DataHeatmapProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataHeatmap: React.FC<DataHeatmapProps> = ({
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

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.timestamp) as [number, number])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([height, 0]);

    // Create color scale
    const colorScale = d3
      .scaleSequential()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .interpolator(d3.interpolateRdYlBu);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g').call(d3.axisLeft(yScale));

    // Add heatmap cells
    const cellWidth = width / 50; // Number of columns
    const cellHeight = height / 30; // Number of rows

    data.forEach((d) => {
      const x = xScale(d.timestamp);
      const y = yScale(d.value);
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      svg
        .append('rect')
        .attr('x', col * cellWidth)
        .attr('y', row * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', colorScale(d.value))
        .attr('opacity', 0.8)
        .append('title')
        .text(
          `Value: ${d.value}\nTime: ${new Date(d.timestamp).toLocaleString()}\nLocation: ${d.location}`
        );
    });

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    const legendScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([0, 200]);

    const legendAxis = d3.axisRight(legendScale);

    legend
      .append('g')
      .call(legendAxis)
      .selectAll('rect')
      .data(d3.range(0, 1.01, 0.01))
      .enter()
      .append('rect')
      .attr('y', (d) => d * 200)
      .attr('height', 200 / 100)
      .attr('fill', (d) => colorScale(d * (d3.max(data, (d) => d.value) || 0)));
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading heatmap...</Typography>
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