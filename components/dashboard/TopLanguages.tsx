import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Language {
  name: string;
  total_seconds: number;
  session_count: number;
}

interface TopLanguagesProps {
  languages: Language[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function TopLanguages({ languages }: TopLanguagesProps) {
  const data = languages.map(lang => ({
    name: lang.name,
    value: lang.total_seconds
  }));

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium">Top Languages</h3>
        <div className="mt-4 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatDuration(value)}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {languages.map((lang, index) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{lang.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDuration(lang.total_seconds)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 