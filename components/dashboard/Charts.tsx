'use client';

import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface ChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  yAxisLabel?: string;
  isMonthly?: boolean;
  isYearly?: boolean;
}

export function LineChart({ data, yAxisLabel, isMonthly, isYearly }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => {
            const parsedDate = parseISO(date);
            if (isYearly) return format(parsedDate, 'yyyy');
            if (isMonthly) return format(parsedDate, 'MMM');
            return format(parsedDate, 'MMM d');
          }}
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          labelFormatter={(date) => {
            const parsedDate = parseISO(date);
            if (isYearly) return format(parsedDate, 'yyyy');
            if (isMonthly) return format(parsedDate, 'MMMM yyyy');
            return format(parsedDate, 'MMM d, yyyy');
          }}
          formatter={(value: number) => [value.toFixed(1), yAxisLabel || '']}
        />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ data, yAxisLabel, isMonthly, isYearly }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => {
            const parsedDate = parseISO(date);
            if (isYearly) return format(parsedDate, 'yyyy');
            if (isMonthly) return format(parsedDate, 'MMM');
            return format(parsedDate, 'MMM d');
          }}
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          labelFormatter={(date) => {
            const parsedDate = parseISO(date);
            if (isYearly) return format(parsedDate, 'yyyy');
            if (isMonthly) return format(parsedDate, 'MMMM yyyy');
            return format(parsedDate, 'MMM d, yyyy');
          }}
          formatter={(value: number) => [value.toFixed(1), yAxisLabel || '']}
        />
        <Bar dataKey="value" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 