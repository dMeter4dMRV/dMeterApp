import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import * as d3 from 'd3';

interface DataBarChartProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataBarChart: React.FC<DataBarChartProps> = ({
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

    // Group data by location and calculate average values
    const groupedData = d3.group(data, (d) => d.location);
    const averages = Array.from(groupedData).map(([location, values]) => ({
      location,
      average: d3.mean(values, (d) => d.value) || 0,
    }));

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(averages.map((d) => d.location))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(averages, (d) => d.average) || 0])
      .range([height, 0]);

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('x', -height / 2)
      .attr('fill', 'currentColor')
      .text('Average Value');

    // Add bars
    svg
      .selectAll('rect')
      .data(averages)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.location) || 0)
      .attr('y', (d) => yScale(d.average))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.average))
      .attr('fill', '#1976d2')
      .append('title')
      .text((d) => `Location: ${d.location}\nAverage Value: ${d.average.toFixed(2)}`);

    // Add value labels on top of bars
    svg
      .selectAll('text.value-label')
      .data(averages)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', (d) => (xScale(d.location) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.average) - 5)
      .attr('text-anchor', 'middle')
      .text((d) => d.average.toFixed(2));
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading bar chart...</Typography>
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