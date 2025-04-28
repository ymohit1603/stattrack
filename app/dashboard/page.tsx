'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Progress } from '@/components/ui/progress';
// import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar,
  Code,
  GitBranch,
  FileCode,
  Loader2,
  // TrendingUp,
  // Users
} from 'lucide-react';
import { statsApi, type StatsResponse } from '@/lib/api';
import { LineChart, BarChart } from '@/components/dashboard/Charts';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { GoalsOverview } from '@/components/dashboard/GoalsOverview';
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<
  'today' | 'last_24_hours' | 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year' | 'all_years'
>('last_7_days');

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await statsApi.getUserStats(timeframe);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeframe]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-destructive">{error || 'Failed to load dashboard'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header with Time Range Selector */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Select 
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as typeof timeframe)}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <div className="text-2xl font-bold">
                {stats.lines_per_day.reduce((acc, day) => acc + day.total_lines, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {stats.lines_per_day.length} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <FileCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.daily_stats.reduce((acc, day) => acc + day.session_count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Daily average: {(stats.daily_stats.reduce((acc, day) => acc + day.session_count, 0) / stats.daily_stats.length).toFixed(1)}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coding Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={stats.daily_stats.map(day => ({
                  date: day.date,
                  value: day.total_seconds / 3600 // Convert to hours
                }))}
                yAxisLabel="Hours"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lines Written</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={stats.lines_per_day.map(day => ({
                  date: day.date,
                  value: day.total_lines
                }))}
                yAxisLabel="Lines"
              />
            </CardContent>
          </Card>
        </div>

        {/* Language Distribution and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LanguageDistribution languages={stats.languages} />
          <RecentSessions sessions={stats.recent_sessions} />
        </div>

        {/* Goals and Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalsOverview goals={stats.goals} />
          <LeaderboardWidget leaderboard={stats.leaderboard} />
        </div>
      </div>
    </div>
  );
}
