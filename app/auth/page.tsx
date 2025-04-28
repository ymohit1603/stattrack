'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Loader2 } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    console.log('AuthPage: checking authentication…');
    try {
      const isAuth = authService.isAuthenticated();
      console.log('AuthPage: isAuthenticated →', isAuth);
      if (isAuth) {
        router.replace('/dashboard');
      }
    } catch (err) {
      console.error('AuthPage: error checking authentication:', err);
    }
  }, [router]);

  const handleOAuth = async (provider: 'twitter' | 'linkedin') => {
    setError(null);
    try {
      setIsLoading(true);
      authService.initiateOAuth(provider);
    } catch (err) {
      console.error(`AuthPage: Failed to authenticate with ${provider}:`, err);
      setError(`Failed to authenticate with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to CodeTrack
          </CardTitle>
          <CardDescription>
            Sign in or create an account to start tracking your coding progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4">
              {error}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => handleOAuth('twitter')}
            disabled={isLoading}
          >
            <Twitter className="h-5 w-5 mr-2" />
            Continue with X (Twitter)
          </Button>

          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => handleOAuth('linkedin')}
            disabled={isLoading}
          >
            <Linkedin className="h-5 w-5 mr-2" />
            Continue with LinkedIn
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
