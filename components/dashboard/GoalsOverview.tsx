'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar } from "lucide-react";
import { LazyLoad } from '@/components/ui/lazy-load';
import { cn } from '@/lib/utils';

interface GoalsOverviewProps {
  goals: {
    daily_coding_time: {
      current: number;
      target: number;
      progress: number;
    };
    weekly_coding_days: {
      current: number;
      target: number;
      progress: number;
    };
  };
}

export function GoalsOverview({ goals }: GoalsOverviewProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  return (
    <LazyLoad>
    <Card>
      <CardHeader>
        <CardTitle>Goals Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Daily Coding Time</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatTime(goals.daily_coding_time.current)} / {formatTime(goals.daily_coding_time.target)}
            </span>
          </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className={cn(
                  "h-full w-full flex-1 transition-all",
                  "bg-green-500"
                )}
                style={{ 
                  width: `${(goals.daily_coding_time.current / goals.daily_coding_time.target) * 100}%` 
                }}
              />
            </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Weekly Coding Days</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {goals.weekly_coding_days.current} / {goals.weekly_coding_days.target} days
            </span>
          </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className={cn(
                  "h-full w-full flex-1 transition-all",
                  "bg-green-500"
                )}
                style={{ 
                  width: `${(goals.weekly_coding_days.current / goals.weekly_coding_days.target) * 100}%` 
                }}
              />
            </div>
        </div>
      </CardContent>
    </Card>
    </LazyLoad>
  );
} 