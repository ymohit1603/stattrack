'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Loader2,
  Info,
  RefreshCw,
  Star,
  Users,
  Code2,
  Plus,
  Trash2,
  Settings,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { userApi, leaderboardApi, statsApi, type StatsResponse } from '@/lib/api';
import type { UserProfile, ProjectStats } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { StatsOverview } from '@/components/profile/StatsOverview';
import { HeatmapComponent } from '@/components/dashboard/HeatmapComponent';
import { TopLanguages } from '@/components/profile/TopLanguages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type TimeRange = 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year';

interface ProfileErrorBoundaryProps {
  children: React.ReactNode;
}

interface ProjectCardProps {
  project: ProjectStats;
  onDelete?: (project: ProjectStats) => void;
}

interface NewProjectFormData {
  name: string;
  description: string;
  language: string;
  isPublic: boolean;
}

// Error Boundary Component
class ProfileErrorBoundary extends React.Component<ProfileErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ProfileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
          <p className="text-destructive">Something went wrong. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto">
      <Card className="mb-8 overflow-hidden border-0 shadow-md">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4 gap-6">
            <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="flex-grow">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Project Card Component
const ProjectCard = React.memo(({ project, onDelete }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    <a
      href={project.has_public_url ? project.url : '#'}
      target={project.has_public_url ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
    >
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <FileCode className="h-6 w-6 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium">{project.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              <Code2 className="h-3 w-3 mr-1" />
              {project.language}
            </Badge>
            <Badge variant="outline" className="text-xs" style={{ backgroundColor: project.color }}>
              {project.badge}
            </Badge>
          </div>
          {project.clients.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Clients: {project.clients.join(', ')}
            </div>
          )}
          <div className="mt-2">
            <Progress value={project.progress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{project.progress}% complete</span>
              <span>Last active {project.human_readable_last_Heartbeat_at}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Project settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {onDelete && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(project);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </a>
  </motion.div>
));

ProjectCard.displayName = 'ProjectCard';

// Stats Card Component
const StatsCard = React.memo(({ 
  title, 
  value, 
  icon: Icon,
  tooltip,
  trend,
  chart
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  tooltip: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
}) => (
  <TooltipProvider>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Tooltip>
          <TooltipTrigger>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} 
            {Math.abs(trend.value).toFixed(1)}% vs previous period
          </p>
        )}
        {chart && <div className="mt-4">{chart}</div>}
      </CardContent>
    </Card>
  </TooltipProvider>
));

StatsCard.displayName = 'StatsCard';

// Empty State Component
const EmptyState = React.memo(({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-8"
  >
    <Icon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
));

EmptyState.displayName = 'EmptyState';

// New Project Dialog
const NewProjectDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (data: NewProjectFormData) => void;
}) => {
  const [formData, setFormData] = useState<NewProjectFormData>({
    name: '',
    description: '',
    language: '',
    isPublic: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
            />
          </div>
          <div>
            <Label htmlFor="language">Primary Language</Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              placeholder="e.g., JavaScript, Python, etc."
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
            <Label htmlFor="isPublic">Make project public</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Profile = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days');
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use SWR for data fetching
  const { data: profile, error: profileError, isLoading: isProfileLoading, mutate: mutateProfile } = useSWR(
    '/api/user/profile',
    () => userApi.getCurrentUser().then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const { data: projects, error: projectsError, isLoading: isProjectsLoading, mutate: mutateProjects } = useSWR(
    '/api/user/projects',
    () => leaderboardApi.getUserProjects().then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const { data: stats, error: statsError, isLoading: isStatsLoading, mutate: mutateStats } = useSWR(
    ['/api/stats', timeRange],
    () => statsApi.getUserStats(timeRange).then(res => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const handleVisibilityToggle = async (checked: boolean) => {
    if (!profile) return;

    try {
      await userApi.toggleProfileVisibility(!checked);
      mutateProfile();
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

  const handleRefresh = () => {
    mutateProfile();
    mutateProjects();
    mutateStats();
  };

  const handleCreateProject = async (data: NewProjectFormData) => {
    try {
      // Implement project creation logic here
      toast({
        title: 'Project created',
        description: 'Your new project has been created successfully.',
      });
      mutateProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (project: ProjectStats) => {
    try {
      // Implement project deletion logic here
      toast({
        title: 'Project deleted',
        description: 'The project has been deleted successfully.',
      });
      mutateProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isProfileLoading || isProjectsLoading || isStatsLoading) {
    return <LoadingSkeleton />;
  }

  if (profileError || projectsError || statsError || !profile) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {profileError?.message || projectsError?.message || statsError?.message || 'Failed to load profile'}
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <ProfileErrorBoundary>
      <TooltipProvider>
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
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="w-fit bg-codeflow-primary/10 text-codeflow-primary border-codeflow-primary/20 text-xs md:text-sm">
                            <Terminal className="h-3 w-3 mr-1" />
                            {profile.subscriptionTier}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current subscription tier</p>
                        </TooltipContent>
                      </Tooltip>
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
                    <Button size="sm" variant="ghost" onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {profile.createdAt && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your account creation date</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {profile.address && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center text-sm">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{profile.address}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your location</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {profile.website && (
                      <Tooltip>
                        <TooltipTrigger>
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
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your personal website</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {profile.github_username && (
                      <Tooltip>
                        <TooltipTrigger>
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
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your GitHub profile</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm">Public Profile</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle profile visibility</p>
                      </TooltipContent>
                    </Tooltip>
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

            <div className="mt-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Activity Heatmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HeatmapComponent initialData={stats?.daily_stats || []} />
                  </CardContent>
                </Card>
              </div>

            <div className="flex flex-col gap-6 mb-6">
               {/* Stats Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Stats</h2>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
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
              
                <Suspense fallback={<Card><CardContent><Loader2 className=" animate-spin" /></CardContent></Card>}>
                  {stats && <StatsOverview stats={stats} />}
                </Suspense>

                <Suspense fallback={<Card><CardContent><Loader2 className=" animate-spin" /></CardContent></Card>}>
                  {stats && <TopLanguages languages={stats.languages} />}
                </Suspense>
              </div>

              
            </div>

            {/* Projects Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Projects</CardTitle>
                <Button size="sm" onClick={() => setIsNewProjectDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {projects?.length > 0 ? (
                      projects.map((project, index) => (
                        <ProjectCard 
                          key={index} 
                          project={project} 
                          onDelete={handleDeleteProject}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={FileCode}
                        title="No projects found"
                        description="You haven't started any projects yet."
                        action={
                          <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(true)}>
                            Create Your First Project
                          </Button>
                        }
                      />
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

           
        </div>

        <NewProjectDialog
          open={isNewProjectDialogOpen}
          onOpenChange={setIsNewProjectDialogOpen}
          onSubmit={handleCreateProject}
        />
      </TooltipProvider>
    </ProfileErrorBoundary>
  );
};

export default Profile;
