import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LanguagesColumn } from './LanguagesColumn';
import type { LeaderboardResponse } from '@/lib/api';

interface LeaderboardTableProps {
  data: LeaderboardResponse['data'];
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Rank</th>
            <th className="text-left py-3 px-4">Coder</th>
            <th className="text-right py-3 px-4">Coding Time</th>
            <th className="text-right py-3 px-4">Active Days</th>
            <th className="text-left py-3 px-4">Languages</th>
          </tr>
        </thead>
        <tbody>
          {data.ranks.map((rank) => (
            <tr 
              key={rank.user.id} 
              className={`border-b hover:bg-muted/50 transition-colors ${
                data.current_user?.rank === rank.rank ? 'bg-muted/30' : ''
              }`}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  {rank.badge && (
                    <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                      {rank.badge === 'gold' ? '🥇' : rank.badge === 'silver' ? '🥈' : '🥉'}
                    </Badge>
                  )}
                  <span className="font-medium">{rank.rank}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={rank.user.profile_url || undefined} />
                    <AvatarFallback>{rank.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{rank.user.username}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                {formatTime(rank.total_seconds)}
              </td>
              <td className="py-4 px-4 text-right">
                {rank.days_coded}
              </td>
              <td className="py-4 px-4">
                <LanguagesColumn languages={rank.languages} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 