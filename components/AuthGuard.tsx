// components/AuthGuard.tsx
'use client';
  
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_PATHS = ['/auth', '/auth/callback', '/leaderboard'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if current path is public, do nothing
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return;

    const token = localStorage.getItem('auth-storage');
    if (!token) {
      // redirect back here after login
      const redirect = encodeURIComponent(pathname);
      router.replace(`/auth?redirect=${redirect}`);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
