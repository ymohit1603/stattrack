'use client';

import { formatDistanceToNow } from 'date-fns';

interface Session {
  start_time: string;
  end_time: string;
  duration: number;
  total_lines: number;
  languages: string[];
}

interface RecentSessionsProps {
  sessions: Session[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium">Recent Sessions</h3>
        <div className="mt-4 space-y-4">
          {sessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {new Date(session.start_time).toLocaleDateString()} {new Date(session.start_time).toLocaleTimeString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                </p>
              </div>
              <div className="text-sm font-medium">
                {Math.floor(session.duration / 60)}m
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 