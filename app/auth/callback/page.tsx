'use client';

import React, { useEffect } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          console.error('No token found in URL');
          router.push('/auth?error=no_token');
          return;
        }

        // Handle the callback with the token
        await authService.handleCallback(token);
        
        // If successful, redirect to dashboard
        redirect('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth?error=callback_failed');
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-muted-foreground">Completing your sign in...</p>
    </div>
  );
}
