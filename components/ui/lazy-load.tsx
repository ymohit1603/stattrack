'use client';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
}

export function LazyLoad({ children, className, placeholder }: LazyLoadProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });
  const hasLoaded = useRef(false);

  // Once loaded, keep the component rendered
  if (isIntersecting) {
    hasLoaded.current = true;
  }

  return (
    <div ref={targetRef} className={cn('w-full', className)}>
      {hasLoaded.current ? (
        children
      ) : (
        placeholder || (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )
      )}
    </div>
  );
} 