'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Code, Calendar, GitBranch } from 'lucide-react';
import type { StatsResponse } from '@/lib/api';

interface StatsOverviewProps {
  stats: StatsResponse;
}

function safeNumber(val: any, fallback = 0) {
  return typeof val === 'number' && !isNaN(val) ? val : fallback;
}

function formatTime(seconds: number): string {
  seconds = safeNumber(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function formatPercentage(val: any): string {
  const num = safeNumber(val, null);
  if (num === null) return '0%';
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  // Defensive: fallback to empty array if undefined
  const linesPerDay = Array.isArray(stats.lines_per_day) ? stats.lines_per_day : [];
  const languages = Array.isArray(stats.languages) ? stats.languages : [];
  // Provide default values for all summary fields
  const {
    today_seconds = 0,
    today_change_percentage = 0,
    avg_daily_seconds = 0,
    avg_daily_change_percentage = 0,
    total_sessions = 0,
    sessions_change_percentage = 0
  } = stats.summary ?? {};

  const totalLines = linesPerDay.reduce((acc, day) => acc + safeNumber(day.total_lines), 0);
  const mostUsedLanguage = languages.length > 0 ? languages[0].language : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Today's Coding Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(today_seconds)}</div>
          <p className={`text-xs ${safeNumber(today_change_percentage) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {safeNumber(today_change_percentage) >= 0 ? '↑' : '↓'} {formatPercentage(today_change_percentage)} vs yesterday
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Daily Time</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(avg_daily_seconds)}</div>
          <p className={`text-xs ${safeNumber(avg_daily_change_percentage) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {safeNumber(avg_daily_change_percentage) >= 0 ? '↑' : '↓'} {formatPercentage(avg_daily_change_percentage)} vs previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeNumber(total_sessions)}</div>
          <p className={`text-xs ${safeNumber(sessions_change_percentage) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {safeNumber(sessions_change_percentage) >= 0 ? '↑' : '↓'} {formatPercentage(sessions_change_percentage)} vs previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Lines Written</CardTitle>
          <GitBranch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLines.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Most used: {mostUsedLanguage}
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 