'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Clock } from 'lucide-react';
import type { StatsResponse } from '@/lib/api';

interface LeaderboardWidgetProps {
  leaderboard: StatsResponse['leaderboard'];
}

export function LeaderboardWidget({ leaderboard }: LeaderboardWidgetProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Top Coders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div key={user.id} className="flex items-center gap-4">
              <div className={`text-sm font-bold ${getRankColor(user.rank)}`}>
                #{user.rank}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {user.days_coded} days coded
                </p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(user.total_seconds)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 