'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Added for privacy toggles
import { userApi, type UserProfile } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Globe, Github, Twitter, Linkedin } from 'lucide-react';

interface EditProfileModalProps {
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  trigger?: React.ReactNode;
}

// interface StatsResponse {
//   range: {
//     start: string;
//     end: string;
//     range: string;
//     timezone: string;
//   };
//   total_seconds: number;
//   daily_average: number;
//   languages: Array<{
//     language: string;
//     Heartbeat_count: number;
//     total_seconds: number;
//     percentage: number;
//   }>;
//   editors: Array<{
//     editor: string;
//     Heartbeat_count: number;
//     total_seconds: number;
//     percentage: number;
//   }>;
//   projects: Array<{
//     project_name: string;
//     repositoryUrl: string | null;
//     Heartbeat_count: number;
//     total_seconds: number;
//     percentage: number;
//   }>;
//   daily_stats: Array<{
//     date: string;
//     total_seconds: number;
//   }>;
//   best_days: Array<{
//     date: string;
//     total_seconds: number;
//     total_lines: number;
//   }>;
//   all_time: {
//     total_coding_time: number;
//     total_lines_written: number;
//     languages_used: string[];
//     daily_average: number;
//   };
// }

export function EditProfileModal({ profile, onProfileUpdate, trigger }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username,
    website: profile.website || '',
    github_username: profile.github_username || '',
    twitter_username: profile.twitter_username || '',
    linkedin_username: profile.linkedin_username || '',
    address: profile.address || '',
    isPrivate: profile.isPrivate,
    editors_used_public: profile.editors_used_public,
    categories_used_public: profile.categories_used_public,
    os_used_public: profile.os_used_public,
    logged_time_public: profile.logged_time_public,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedProfile = await userApi.updateProfile(formData);
      onProfileUpdate(updatedProfile);
      setIsOpen(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      toast({
        title: "Error",
        description: `${errorMessage}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit Profile</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information and privacy settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              type="url"
              prefix={<Globe className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_username">GitHub Username</Label>
            <Input
              id="github_username"
              name="github_username"
              value={formData.github_username}
              onChange={handleChange}
              placeholder="username"
              prefix={<Github className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_username">Twitter Username</Label>
            <Input
              id="twitter_username"
              name="twitter_username"
              value={formData.twitter_username}
              onChange={handleChange}
              placeholder="username"
              prefix={<Twitter className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_username">LinkedIn Username</Label>
            <Input
              id="linkedin_username"
              name="linkedin_username"
              value={formData.linkedin_username}
              onChange={handleChange}
              placeholder="username"
              prefix={<Linkedin className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Location</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">Privacy Settings</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="isPrivate">Private Profile</Label>
              <Switch
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isPrivate: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="editors_used_public">Show Editors Used</Label>
              <Switch
                id="editors_used_public"
                name="editors_used_public"
                checked={formData.editors_used_public}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, editors_used_public: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="categories_used_public">Show Categories</Label>
              <Switch
                id="categories_used_public"
                name="categories_used_public"
                checked={formData.categories_used_public}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, categories_used_public: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="os_used_public">Show Operating System</Label>
              <Switch
                id="os_used_public"
                name="os_used_public"
                checked={formData.os_used_public}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, os_used_public: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="logged_time_public">Show Logged Time</Label>
              <Switch
                id="logged_time_public"
                name="logged_time_public"
                checked={formData.logged_time_public}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, logged_time_public: checked }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}