'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Code, Calendar, GitBranch } from 'lucide-react';
import type { StatsResponse } from '@/lib/api';

interface StatsOverviewProps {
  stats: StatsResponse;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
  };

  const totalLines = stats.lines_per_day.reduce((acc, day) => acc + day.total_lines, 0);
  const totalSessions = stats.daily_stats.reduce((acc, day) => acc + day.session_count, 0);
  const avgDailyTime = stats.daily_stats.reduce((acc, day) => acc + day.total_seconds, 0) / stats.daily_stats.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Coding Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(stats.summary.total_seconds)}</div>
          <p className={`text-xs ${stats.summary.change_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.summary.change_percentage >= 0 ? '↑' : '↓'} 
            {Math.abs(stats.summary.change_percentage).toFixed(1)}% vs previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Lines Written</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLines.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Across {stats.lines_per_day.length} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(avgDailyTime)}</div>
          <p className="text-xs text-muted-foreground">
            {totalSessions} total sessions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Languages Used</CardTitle>
          <GitBranch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.languages.length}</div>
          <p className="text-xs text-muted-foreground">
            Most used: {stats.languages[0]?.language || 'N/A'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 