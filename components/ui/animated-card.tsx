'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, title, className, delay = 0 }: AnimatedCardProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2, // Trigger when 20% of the element is visible
    rootMargin: '50px', // Start animation slightly before the element comes into view
  });
  const hasAnimated = useRef(false);

  return (
    <motion.div
      ref={targetRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isIntersecting && !hasAnimated.current ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onAnimationComplete={() => {
        hasAnimated.current = true;
      }}
      className={cn('w-full', className)}
    >
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
} 