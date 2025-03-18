import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  timestamp: number;
  value: number;
  location: string;
  dataType: string;
}

interface EnvironmentalDataChartProps {
  data: DataPoint[];
  title: string;
  dataType: string;
}

export const EnvironmentalDataChart: React.FC<EnvironmentalDataChartProps> = ({
  data,
  title,
  dataType
}) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatValue = (value: number) => {
    return `${value} ${dataType}`;
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            label={{ value: 'Date', position: 'bottom' }}
          />
          <YAxis
            tickFormatter={formatValue}
            label={{ value: dataType, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={formatTimestamp}
            formatter={(value: number) => [formatValue(value), 'Value']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 