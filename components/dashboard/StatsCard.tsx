import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-sm font-medium">{title}</h3>
          </div>
          <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        </div>
        <div className="mt-4 text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
} 