'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar } from "lucide-react";
import { LazyLoad } from '@/components/ui/lazy-load';

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
            <Progress value={goals.daily_coding_time.progress} className="h-2" />
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
            <Progress value={goals.weekly_coding_days.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </LazyLoad>
  );
} 