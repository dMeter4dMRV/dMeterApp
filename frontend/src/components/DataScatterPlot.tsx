import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import * as d3 from 'd3';

interface DataScatterPlotProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataScatterPlot: React.FC<DataScatterPlotProps> = ({
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

    // Create color scale for different data types
    const dataTypes = Array.from(new Set(data.map((d) => d.dataType)));
    const colorScale = d3
      .scaleOrdinal()
      .domain(dataTypes)
      .range(d3.schemeCategory10);

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

    // Add dots
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.timestamp))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 5)
      .attr('fill', (d) => colorScale(d.dataType))
      .attr('opacity', 0.7)
      .append('title')
      .text(
        (d) =>
          `Type: ${d.dataType}\nValue: ${d.value}\nTime: ${new Date(
            d.timestamp
          ).toLocaleString()}\nLocation: ${d.location}`
      );

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    dataTypes.forEach((type, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('circle')
        .attr('r', 5)
        .attr('fill', colorScale(type));

      legendRow
        .append('text')
        .attr('x', 10)
        .attr('y', 5)
        .text(type);
    });
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading scatter plot...</Typography>
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