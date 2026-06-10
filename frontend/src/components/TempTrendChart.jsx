import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Thermometer } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-neutral-400 mb-1">
        {new Date(label).toLocaleString()}
      </p>
      <p className="text-sm font-semibold text-warning-400">
        Temperature: {payload[0].value}°C
      </p>
    </div>
  );
}

export default function TempTrendChart({ trends }) {
  const data = trends.map(t => ({
    timestamp: t.timestamp,
    temperature: t.temperature,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="w-4 h-4 text-warning-400" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
            Temperature Trend
          </h3>
        </div>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-neutral-500">No trend data available</p>
        </div>
      </div>
    );
  }

  const minTemp = Math.min(...data.map(d => d.temperature));
  const maxTemp = Math.max(...data.map(d => d.temperature));
  const yDomain = [Math.max(0, minTemp - 5), maxTemp + 5];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="w-4 h-4 text-warning-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Temperature Trend
        </h3>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              domain={yDomain}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#tempGradient)"
              dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
