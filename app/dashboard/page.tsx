'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Clock, 
  Calendar,
  Code,
  GitBranch,
  FileCode,
  Loader2,
  TrendingUp,
  Activity,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { statsApi, type StatsResponse } from '@/lib/api';
import { LineChart, BarChart } from '@/components/dashboard/Charts';
import { LanguageDistribution } from '@/components/dashboard/LanguageDistribution';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { GoalsOverview } from '@/components/dashboard/GoalsOverview';
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';
import { formatTime } from '@/lib/utils';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import { format } from 'date-fns';

// Types
type Timeframe = 'today' | 'last_24_hours' | 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year' | 'all_years';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
}

// Error Boundary Component
class DashboardErrorBoundary extends React.Component<DashboardErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
          <p className="text-destructive">Something went wrong. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-[180px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = React.memo(({ 
  title, 
  value, 
  change, 
  icon: Icon,
  tooltip
}: { 
  title: string; 
  value: string | number; 
  change: number; 
  icon: React.ElementType;
  tooltip: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>

      </Tooltip>
      </TooltipProvider>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '↑' : '↓'} 
        {Math.abs(change).toFixed(1)}% vs previous period
      </p>
    </CardContent>
  </Card>
));

StatsCard.displayName = 'StatsCard';

// Main Dashboard Component
export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>('last_7_days');
  const { theme, setTheme } = useTheme();

  // Use SWR for data fetching with automatic revalidation
  const { data: stats, error, isLoading, mutate } = useSWR(
    ['/api/stats', timeframe],
    () => statsApi.getUserStats(timeframe).then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  // Memoize formatted data for charts
  const chartData = useMemo(() => {
    if (!stats) return null;

    const processData = (data: Array<{ date: string; value: number }>) => {
      if (timeframe === 'all_years') {
        // Group data by year
        const yearlyData = data.reduce((acc, item) => {
          const date = new Date(item.date);
          const yearKey = format(date, 'yyyy');
          if (!acc[yearKey]) {
            acc[yearKey] = {
              date: yearKey,
              value: 0
            };
          }
          acc[yearKey].value += item.value;
          return acc;
        }, {} as Record<string, { date: string; value: number }>);

        // Convert to array and sort by date
        return Object.values(yearlyData).sort((a, b) => a.date.localeCompare(b.date));
      } else if (timeframe === 'last_6_months') {
        // Group data by month
        const monthlyData = data.reduce((acc, item) => {
          const date = new Date(item.date);
          const monthKey = format(date, 'yyyy-MM');
          if (!acc[monthKey]) {
            acc[monthKey] = {
              date: monthKey,
              value: 0
            };
          }
          acc[monthKey].value += item.value;
          return acc;
        }, {} as Record<string, { date: string; value: number }>);

        // Convert to array and sort by date
        return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
      } else if (timeframe === 'last_year') {
        // Group data by month
        const monthlyData = data.reduce((acc, item) => {
          const date = new Date(item.date);
          const monthKey = format(date, 'yyyy-MM');
          if (!acc[monthKey]) {
            acc[monthKey] = {
              date: monthKey,
              value: 0
            };
          }
          acc[monthKey].value += item.value;
          return acc;
        }, {} as Record<string, { date: string; value: number }>);

        // Convert to array and sort by date
        return Object.values(monthlyData).sort((a, b) => a.date.localeCompare(b.date));
      }

      // For other timeframes, return daily data
      return data;
    };

    return {
      activity: processData(stats.daily_stats.map(day => ({
        date: day.date,
        value: day.total_seconds / 3600
      }))),
      lines: processData(stats.lines_per_day.map(day => ({
        date: day.date,
        value: day.total_lines
      })))
    };
  }, [stats, timeframe]);

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error?.message || 'Failed to load dashboard'}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header with Time Range Selector and Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Select 
                value={timeframe}
                onValueChange={(value) => setTimeframe(value as Timeframe)}
              >
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
      
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="all_years">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="icon"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                variant="outline"
                size="icon"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Coding Time"
              value={stats.summary.total_seconds != null ? formatTime(stats.summary.total_seconds) : "0:00"}
              change={stats.summary.change_percentage}
              icon={Clock}
              tooltip="Total time spent coding in the selected period"
            />
            <StatsCard
              title="Today's Coding Time"
              value={(stats.summary.today_seconds != null ? formatTime(stats.summary.today_seconds) : "0:00")}
              change={stats.summary.today_change_percentage}
              icon={Calendar}
              tooltip="Time spent coding today"
            />
            <StatsCard
              title="Average Daily Time"
              value={formatTime(stats.summary.avg_daily_seconds)}
              change={stats.summary.avg_daily_change_percentage}
              icon={TrendingUp}
              tooltip="Average time spent coding per day"
            />
            <StatsCard
              title="Total Sessions"
              value={stats.summary.total_sessions}
              change={stats.summary.sessions_change_percentage}
              icon={Activity}
              tooltip="Total number of coding sessions"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Suspense fallback={<Card><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coding Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData && (
                    <BarChart 
                      data={chartData.activity}
                      yAxisLabel="Hours"
                      isMonthly={timeframe === 'last_year' || timeframe === 'last_6_months'}
                      isYearly={timeframe === 'all_years'}
                    />
                  )}
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lines Written</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData && (
                    <LineChart 
                      data={chartData.lines}
                      yAxisLabel="Lines"
                      isMonthly={timeframe === 'last_year' || timeframe === 'last_6_months'}
                      isYearly={timeframe === 'all_years'}
                    />
                  )}
                </CardContent>
              </Card>
            </Suspense>
          </div>

          {/* Language Distribution and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Suspense fallback={<Card><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>}>
              <LanguageDistribution 
                languages={stats.languages} 
                timeframe={timeframe}
              />
            </Suspense>
            <Suspense fallback={<Card><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>}>
              <RecentSessions sessions={stats.recent_sessions} />
            </Suspense>
          </div>

          {/* Goals and Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<Card><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>}>
              <GoalsOverview goals={stats.goals} />
            </Suspense>
            <Suspense fallback={<Card><CardContent><Loader2 className="h-8 w-8 animate-spin" /></CardContent></Card>}>
              <LeaderboardWidget leaderboard={stats.leaderboard} />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
}
