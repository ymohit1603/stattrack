'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LazyLoad } from '@/components/ui/lazy-load';
import type { StatsResponse } from '@/lib/api';
import { format } from 'date-fns';

interface RecentSessionsProps {
  sessions: StatsResponse['recent_sessions'];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <LazyLoad>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">
                    {format(new Date(session.start_time), 'MMM d, h:mm a')}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatTime(session.duration)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </LazyLoad>
  );
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
} 