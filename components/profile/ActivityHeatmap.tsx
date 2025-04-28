'use client';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsResponse } from '@/lib/api';

interface ActivityHeatmapProps {
  stats: StatsResponse;
}

interface CalendarValue {
  date: string;
  count: number;
}

export function ActivityHeatmap({ stats }: ActivityHeatmapProps) {
  const getColor = (value: number) => {
    if (!value) return 'color-empty';
    if (value < 3600) return 'color-scale-1'; // Less than 1 hour
    if (value < 7200) return 'color-scale-2'; // Less than 2 hours
    if (value < 14400) return 'color-scale-3'; // Less than 4 hours
    return 'color-scale-4'; // 4+ hours
  };

  const startDate = new Date(stats.range.start);
  const endDate = new Date(stats.range.end);

  const values = stats.daily_stats.map(day => ({
    date: day.date,
    count: day.total_seconds
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Coding Activity</CardTitle>
        <div className="text-sm text-muted-foreground">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="py-4">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={values}
            classForValue={(value: CalendarValue | null) => {
              if (!value) return 'color-empty';
              return getColor(value.count);
            }}
            tooltipDataAttrs={(value: CalendarValue | null) => ({
              'data-tip': value?.date 
                ? `${new Date(value.date).toLocaleDateString()}: ${Math.round(value.count / 3600)}h` 
                : 'No activity',
            })}
          />
        </div>
        <div className="flex justify-center items-center gap-2 mt-4">
          <span className="text-xs text-muted-foreground">Less</span>
          {['color-empty', 'color-scale-1', 'color-scale-2', 'color-scale-3', 'color-scale-4'].map((color) => (
            <div
              key={color}
              className={`w-3 h-3 rounded-sm ${color}`}
            />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
} 