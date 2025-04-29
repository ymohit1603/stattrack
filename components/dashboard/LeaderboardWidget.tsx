'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Clock, Zap } from 'lucide-react';
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
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      default: return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Top Coders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankColor(user.rank)}`}>
                {user.rank}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profile_url || undefined} alt={user.username} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">@{user.username}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 mr-1 text-amber-500" />
                  {user.days_coded} days coded
                </div>
              </div>
              <div className="flex items-center text-sm font-medium">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                {formatTime(user.total_seconds)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 