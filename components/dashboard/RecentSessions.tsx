'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Code } from 'lucide-react';
import type { StatsResponse } from '@/lib/api';

interface RecentSessionsProps {
  sessions: StatsResponse['recent_sessions'];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  Coded for {formatTime(session.duration)}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Code className="h-3 w-3 mr-1" />
                  {session.languages.join(', ')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(session.start_time)}
                </p>
              </div>
              <div className="text-xs font-medium">
                {session.total_lines > 0 && `+${session.total_lines} lines`}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 