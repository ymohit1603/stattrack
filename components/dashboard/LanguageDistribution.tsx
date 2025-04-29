'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsResponse } from '@/lib/api';

interface LanguageDistributionProps {
  languages: StatsResponse['languages'];
  timeframe: string;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

export function LanguageDistribution({ languages, timeframe }: LanguageDistributionProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Calculate total seconds for percentage calculation
  const totalSeconds = languages.reduce((sum, lang) => sum + lang.total_seconds, 0);

  // Transform data to include percentages
  const chartData = languages.map(lang => ({
    name: lang.language,
    value: lang.total_seconds,
    percentage: (lang.total_seconds / totalSeconds) * 100
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatTime(value), 'Time']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {chartData.slice(0, 5).map((lang, index) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm">{lang.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatTime(lang.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 