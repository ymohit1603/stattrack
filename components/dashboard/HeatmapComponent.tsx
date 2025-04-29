// HeatmapComponent.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import { format, getYear, startOfYear, endOfYear } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { statsApi } from '@/lib/api';
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';

interface HeatmapData {
  date: string;
  total_seconds: number;
}

export function HeatmapComponent({ initialData = [] }: { initialData?: HeatmapData[] }) {
  const [selectedYear, setSelectedYear] = useState<number>(getYear(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>(initialData);
  const [yearCache, setYearCache] = useState<Record<string, HeatmapData[]>>({});

  const debouncedYear = useDebounce(selectedYear, 200);

  const years = useMemo(() => {
    const current = getYear(new Date());
    return Array.from({ length: 5 }, (_, i) => current - i);
  }, []);

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: startOfYear(new Date(debouncedYear, 0, 1)),
      endDate: endOfYear(new Date(debouncedYear, 11, 31)),
    }),
    [debouncedYear]
  );

  const fetchHeatmapData = useCallback(
    async (year: number) => {
      const key = year.toString();
      if (yearCache[key]) {
        setHeatmapData(yearCache[key]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await statsApi.getHeatmapStats(year);
        setYearCache(prev => ({ ...prev, [key]: data }));
        setHeatmapData(data);
      } catch (err) {
        console.error('Failed to fetch heatmap data', err);
      } finally {
        setIsLoading(false);
      }
    },
    [yearCache]
  );

  useEffect(() => {
    if (!initialData.length) fetchHeatmapData(selectedYear);
  }, [initialData, selectedYear]);

  useEffect(() => {
    fetchHeatmapData(debouncedYear);
  }, [debouncedYear]);

  const values = heatmapData.map(d => ({ date: d.date, count: d.total_seconds }));

  const classForValue = (v: { date: string; count: number } | null) => {
    if (!v || v.count === 0) return 'color-empty';
    if (v.count < 3600)    return 'color-scale-3';
    if (v.count < 7200)    return 'color-scale-2';
    if (v.count < 14400)   return 'color-scale-1';
    return 'color-scale-4';
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  const tooltipDataAttrs = (v: { date: string; count: number } | null) => {
    if (!v) return {};
    const dateLabel = format(new Date(v.date), 'MMM d, yyyy');
    const timeStr = formatTime(v.count);
    return {
      'data-tooltip-id': 'heatmap-tooltip',
      'data-tooltip-content': `${dateLabel}: ${timeStr}`,
    };
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Contributions</h2>
        <Select value={String(selectedYear)} onValueChange={val => setSelectedYear(+val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(y => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center z-10">
            <Spinner className="w-6 h-6" />
          </div>
        )}

        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={classForValue}
          tooltipDataAttrs={tooltipDataAttrs}
          showWeekdayLabels
          weekStart={0}
          showOutOfRangeDays={false}
          weekdayLabels={['Sun','Mon','Tue','Wed','Thu','Fri','Sat']}
          monthLabels={['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}
          rectSize={12}
          gutterSize={4}
          rectProps={{ rx: 2, ry: 2, className: 'cursor-pointer' }}
        />

        <Tooltip id="heatmap-tooltip" place="top" delayShow={100} />
      </div>
    </div>
);
}
