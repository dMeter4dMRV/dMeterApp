import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EnvironmentalData } from '../utils/api';
import * as d3 from 'd3';

interface DataPieChartProps {
  data: EnvironmentalData[];
  loading?: boolean;
}

export const DataPieChart: React.FC<DataPieChartProps> = ({
  data,
  loading = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Group data by data type and calculate total values
    const groupedData = d3.group(data, (d) => d.dataType);
    const pieData = Array.from(groupedData).map(([type, values]) => ({
      type,
      value: d3.sum(values, (d) => d.value),
    }));

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(pieData.map((d) => d.type))
      .range(d3.schemeCategory10);

    // Create pie generator
    const pie = d3
      .pie<{ type: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<{ type: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Add pie segments
    const segments = svg
      .selectAll('path')
      .data(pie(pieData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.data.type))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .append('title')
      .text(
        (d) =>
          `Type: ${d.data.type}\nTotal Value: ${d.data.value.toFixed(2)}\nPercentage: ${(
            (d.data.value / d3.sum(pieData, (d) => d.value)) *
            100
          ).toFixed(1)}%`
      );

    // Add labels
    const label = d3
      .arc<d3.PieArcDatum<{ type: string; value: number }>>()
      .innerRadius(radius + 20)
      .outerRadius(radius + 40);

    svg
      .selectAll('text')
      .data(pie(pieData))
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${label.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(
        (d) =>
          `${d.data.type}\n${(
            (d.data.value / d3.sum(pieData, (d) => d.value)) *
            100
          ).toFixed(1)}%`
      );

    // Add total value in the center
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text(`Total: ${d3.sum(pieData, (d) => d.value).toFixed(2)}`);

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${radius + 60}, -${radius / 2})`);

    pieData.forEach((d, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(d.type));

      legendRow
        .append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(`${d.type}: ${d.value.toFixed(2)}`);
    });
  }, [data]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading pie chart...</Typography>
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