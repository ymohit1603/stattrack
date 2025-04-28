'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Clock, Star, Search, Zap, Loader2, GitCommit, Code } from 'lucide-react';
import { leaderboardApi } from '@/lib/api';

interface LeaderboardData {
  range: {
    start: string;
    end: string;
    range: string;
    timezone: string;
  };
  current_user: {
    rank: number;
    total_seconds: number;
    days_coded: number;
    running_total: number;
  } | null;
  language: string | null;
  page: number;
  total_pages: number;
  ranks: Array<{
    user: {
      id: number;
      username: string;
      profile_url: string | null;
    };
    rank: number;
    running_total: number;
    total_seconds: number;
    days_coded: number;
    badge: 'gold' | 'silver' | 'bronze' | null;
  }>;
}

const Leaderboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState<'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year'>('last_7_days');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [filteredRanks, setFilteredRanks] = useState<LeaderboardData['ranks']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await leaderboardApi.getLeaderboard(timeframe);
        setLeaderboardData(response.data);
        setFilteredRanks(response.data.ranks);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!leaderboardData) return;
    
    if (term.trim() === '') {
      setFilteredRanks(leaderboardData.ranks);
    } else {
      setFilteredRanks(
        leaderboardData.ranks.filter(rank => 
          rank.user.username.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  const getRankStyles = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="hero-gradient rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <Trophy className="h-8 w-8 inline-block mr-3" />
            Coder Leaderboard
          </h1>
          <p className="text-lg opacity-90 mb-4">
            See how you stack up against the top coders in the community
          </p>
          {leaderboardData?.current_user && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">Your Current Position</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-2xl font-bold">#{leaderboardData.current_user.rank}</div>
                <div>
                  <p className="text-sm opacity-80">{formatTime(leaderboardData.current_user.total_seconds)} coded</p>
                  <p className="text-sm opacity-80">{leaderboardData.current_user.days_coded} active days</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search coders..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-4 items-center">
            <Select 
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as typeof timeframe)}
            >
              <SelectTrigger className="w-[180px]">
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Leaderboard */}
        <Card className="overflow-hidden mb-8">
          <CardHeader className="bg-gray-100 dark:bg-gray-800">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-codeflow-primary" />
              Top Coders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left whitespace-nowrap p-4">Rank</th>
                    <th className="text-left whitespace-nowrap p-4">Coder</th>
                    <th className="text-left whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Coding Time
                      </div>
                    </th>
                    <th className="text-left whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Active Days
                      </div>
                    </th>
                    <th className="text-left whitespace-nowrap p-4">Achievement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRanks.map((rank) => (
                    <tr 
                      key={rank.user.id} 
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankStyles(rank.rank)}`}>
                          {rank.rank}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={rank.user.profile_url || undefined} alt={rank.user.username} />
                            <AvatarFallback>{rank.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">@{rank.user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{formatTime(rank.total_seconds)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-amber-500" />
                          {rank.days_coded} days
                        </div>
                      </td>
                      <td className="p-4">
                        {rank.badge && (
                          <Badge 
                            variant="outline" 
                            className={`
                              ${rank.badge === 'gold' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                              ${rank.badge === 'silver' ? 'bg-gray-400/10 text-gray-400 border-gray-400/20' : ''}
                              ${rank.badge === 'bronze' ? 'bg-amber-600/10 text-amber-600 border-amber-600/20' : ''}
                            `}
                          >
                            {rank.badge.charAt(0).toUpperCase() + rank.badge.slice(1)} Coder
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <span>JavaScript</span>
                  </div>
                  <span className="font-medium">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>TypeScript</span>
                  </div>
                  <span className="font-medium">24%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Python</span>
                  </div>
                  <span className="font-medium">18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Java</span>
                  </div>
                  <span className="font-medium">12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span>C#</span>
                  </div>
                  <span className="font-medium">8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    <span>Others</span>
                  </div>
                  <span className="font-medium">6%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Daily Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-codeflow-primary">4.8</div>
                <div className="text-gray-500 mt-2">hours per day</div>
                
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Community average</span>
                    <span>3.2h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Top 10% average</span>
                    <span>6.5h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your position</span>
                    <span className="font-medium text-codeflow-primary">Top 25%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-codeflow-primary/10 mr-3">
                    <Trophy className="h-5 w-5 text-codeflow-primary" />
                  </div>
                  <div>
                    <div className="font-medium">TypeScript Expert</div>
                    <div className="text-sm text-gray-500">Awarded to Samantha B.</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-amber-500/10 mr-3">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-medium">50-Day Streak</div>
                    <div className="text-sm text-gray-500">Awarded to Emma D.</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-500/10 mr-3">
                    <GitCommit className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">1000+ Commits</div>
                    <div className="text-sm text-gray-500">Awarded to Alex J.</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-blue-500/10 mr-3">
                    <Code className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Polyglot Coder</div>
                    <div className="text-sm text-gray-500">Awarded to Michael C.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
