import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LanguagesColumn } from './LanguagesColumn';
import type { LeaderboardResponse } from '@/lib/api';
import { Linkedin } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const getCharacterInfo = (level: number) => {
  const characters = [
    { name: "Stannis Baratheon", image: "👨‍⚖️💻", slogan: "The night is dark and full of bug!" },
    { name: "Jon Snow", image: "🧑‍💻❄️", slogan: "If I fall, don't bring me back." },
    { name: "Sandor Clegane", image: "🔥🐶", slogan: "Remember Me? Yeah, You Do. You're Even Uglier Than I Am Now." },
    { name: "Jaime Lannister", image: "✋⚔️", slogan: "The code is full of bugs, Tommen. You can fix them, or laugh at them" },
    { name: "Robb Stark", image: "🐺👑", slogan: "How can I call myself a programmer If I can't center a div?" },
    { name: "Tywin Lannister", image: "📈🧠", slogan: "A Lannister always pays his debts." },
    { name: "Ned Stark", image: "☃️⚔️", slogan: "You vibe-coded it well when vibe-coding was safe." },
    { name: "Bronn", image: "💰🖥️", slogan: "Debugging is where our partnership ends. " },
    { name: "The Night King", image: "👻❄️", slogan: "I see dead pull requests." },
    { name: "Arya Stark", image: "🗡️🎯", slogan: "Leave one wolf alive and the sheep are never safe." },
    { name: "Jaqen H'ghar", image: "🎭⚔️", slogan: "Valar morghulis." }
  ];
  return characters[Math.min(level - 1, characters.length - 1)];
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Rank</th>
            <th className="text-left py-3 px-4">Coder</th>
            <th className="text-left py-3 px-4">Level</th>
            <th className="text-right py-3 px-4">Coding Time</th>
            <th className="text-right py-3 px-4">Active Days</th>
            <th className="text-left py-3 px-4">Languages</th>
          </tr>
        </thead>
        <tbody>
          {data.ranks.map((rank) => {
            const character = getCharacterInfo(rank.level || 1);
            return (
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
                    <span className="font-medium">{rank.user.username}{rank.user.app_name=="X" ? <FaXTwitter />:rank.user.app_name=="LinkedIn" ? <Linkedin className="h-4 w-4" />:null}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col cursor-pointer">
                          <span className="text-sm font-medium">{character.name}</span>
                          <span className="text-xs text-muted-foreground">Level {rank.level || 1}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="whitespace-pre-line">{character.slogan}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="py-4 px-4 text-right">
                  {formatTime(rank.total_seconds)}
                </td>
                <td className="py-4 px-4 text-right">
                  {rank.days_coded}
                </td>
                <td className="py-4 px-4">
                  <LanguagesColumn languages={rank.languages_breakdown} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; 