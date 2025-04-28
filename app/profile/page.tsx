'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  ChevronRight,
  Edit,
  Eye,
  FileCode,
  Github,
  Globe,
  Share2,
  Shield,
  Terminal,
  Loader2
} from 'lucide-react';
import { userApi, leaderboardApi, statsApi, type StatsResponse } from '@/lib/api';
import type { UserProfile, ProjectStats } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { StatsOverview } from '@/components/profile/StatsOverview';
import { ActivityHeatmap } from '@/components/profile/ActivityHeatmap';
import { TopLanguages } from '@/components/profile/TopLanguages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ProjectStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [timeRange, setTimeRange] = useState<'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year'>('last_7_days');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [profileData, projectsData] = await Promise.all([
          userApi.getCurrentUser(),
          leaderboardApi.getUserProjects()
        ]);
        console.log("profileData", profileData.data);
        setProfile(profileData.data);
        setProjects(projectsData.data);
        console.log("project data",projectsData.data);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsApi.getUserStats(timeRange);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [timeRange]);

  const handleVisibilityToggle = async (checked: boolean) => {
    if (!profile) return;

    try {
      await userApi.toggleProfileVisibility(!checked);
      setProfile({ ...profile, isPrivate: !checked });
      toast({
        title: 'Profile visibility updated',
        description: `Your profile is now ${checked ? 'public' : 'private'}`,
      });
    } catch (err) {
      console.error('Failed to update profile visibility:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile visibility. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (profile?.isPrivate) {
      toast({
        title: 'Cannot share private profile',
        description: 'Make your profile public to share it with others.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/profile/${profile.username}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Profile link copied',
        description: 'Share this link with others to show them your coding stats!',
      });
    } catch (err) {
      console.error('Failed to copy profile link:', err);
      toast({
        title: 'Error',
        description: 'Failed to copy profile link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditProfile = () => {
    toast({
      title: 'Coming soon',
      description: 'Profile editing will be available soon!',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-destructive">{error || 'Failed to load profile'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-0 shadow-md">
          <div className="h-32 bg-gradient-to-r from-codeflow-primary via-codeflow-secondary to-codeflow-accent"></div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4 gap-6">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 rounded-full shadow-md">
                <AvatarImage src={profile.profile_url} alt={profile.username} />
                <AvatarFallback>{profile.username}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                  <Badge className="w-fit bg-codeflow-primary/10 text-codeflow-primary border-codeflow-primary/20 text-xs md:text-sm">
                    <Terminal className="h-3 w-3 mr-1" />
                    {profile.subscriptionTier}
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">@{profile.username}</p>
                {profile.address && <p className="mt-2 text-sm md:text-base">{profile.address}</p>}
              </div>
              <div className="flex space-x-2 md:self-start md:mt-8">
                <Button size="sm" variant="outline" className="border-codeflow-primary text-codeflow-primary" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button size="sm" variant="ghost" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
              <div className="flex flex-wrap gap-4 md:gap-6">
                {profile.createdAt && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    <a
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-codeflow-primary hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                {profile.github_username && (
                  <div className="flex items-center text-sm">
                    <Github className="h-4 w-4 mr-2 text-gray-500" />
                    <a
                      href={`https://github.com/${profile.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-codeflow-primary hover:underline"
                    >
                      {profile.github_username}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Public Profile</span>
                <Switch checked={!profile.isPrivate} onCheckedChange={handleVisibilityToggle} />
                {!profile.isPrivate ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <Shield className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length>0&&projects.map((project, index) => (
                <a
                  key={index}
                  href={project.has_public_url ? project.url : '#'}
                  target={project.has_public_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{project.name}</div>
                      <Badge style={{ backgroundColor: project.color }} className="text-white text-xs">
                        {project.badge}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">{project.language}</div>
                    {project.clients.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Clients: {project.clients.join(', ')}
                      </div>
                    )}
                    <div className="mt-2">
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs">
                        <span>{project.progress}% complete</span>
                        <span>Last active {project.human_readable_last_Heartbeat_at}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects yet</p>
                  <Button variant="outline" className="mt-4">
                    Create Your First Project
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="container mx-auto py-8 px-4 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Coding Statistics</h1>
            <Select 
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as typeof timeRange)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {stats && <StatsOverview stats={stats} />}
          
          {stats && <ActivityHeatmap stats={stats} />}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats && <TopLanguages languages={stats.languages} />}
            {/* Add more components here as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
