import { useState, useEffect } from 'react';
import { getAvailableDrives, getSmartSummary } from '../api/smartApi';
import { HardDrive, ArrowRightLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function DriveComparison() {
  const [drives, setDrives] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparison() {
      try {
        const available = await getAvailableDrives();
        setDrives(available);

        const results = [];
        for (const drive of available) {
          try {
            const summary = await getSmartSummary();
            if (summary && summary.device === drive.device) {
              results.push({
                device: drive.device,
                model: drive.model,
                type: drive.type,
                healthScore: summary.health?.healthScore ?? '--',
                healthCategory: summary.health?.healthCategory ?? 'Unknown',
                temperature: summary.temperature ?? '--',
                failureProbability: summary.mlPrediction?.failureProbability ?? null,
              });
            }
          } catch (e) {
            results.push({
              device: drive.device,
              model: drive.model,
              type: drive.type,
              healthScore: '--',
              healthCategory: 'Unknown',
              temperature: '--',
              failureProbability: null,
            });
          }
        }
        setComparison(results);
      } catch (err) {
        console.error('Failed to fetch comparison:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchComparison();
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Drive Comparison</h3>
        </div>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-12 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (comparison.length < 2) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Drive Comparison</h3>
        </div>
        <p className="text-sm text-neutral-400 text-center py-4">Connect multiple drives to see comparison.</p>
      </div>
    );
  }

  const bestHealth = Math.max(...comparison.map(d => typeof d.healthScore === 'number' ? d.healthScore : 0));

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Drive Comparison</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-2 px-3 text-neutral-500 font-medium">Device</th>
              <th className="text-left py-2 px-3 text-neutral-500 font-medium">Type</th>
              <th className="text-left py-2 px-3 text-neutral-500 font-medium">Health</th>
              <th className="text-left py-2 px-3 text-neutral-500 font-medium">Status</th>
              <th className="text-left py-2 px-3 text-neutral-500 font-medium">Temp</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((drive, idx) => {
              const isBest = drive.healthScore === bestHealth && typeof drive.healthScore === 'number';
              const healthColor = drive.healthScore >= 90 ? 'text-success-400' : drive.healthScore >= 75 ? 'text-warning-400' : drive.healthScore >= 50 ? 'text-orange-400' : 'text-danger-400';
              const TrendIcon = isBest ? TrendingUp : drive.healthScore >= 75 ? Minus : TrendingDown;

              return (
                <tr key={idx} className={`border-b border-neutral-800/50 ${isBest ? 'bg-success-500/5' : ''}`}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-200 font-mono text-xs">{drive.device}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${drive.type?.includes('SSD') ? 'bg-primary-500/10 text-primary-400' : 'bg-warning-500/10 text-warning-400'}`}>
                      {drive.type}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${healthColor}`}>{drive.healthScore}</span>
                      {isBest && <TrendingUp className="w-3.5 h-3.5 text-success-400" />}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs ${healthColor}`}>{drive.healthCategory}</span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400">
                    {drive.temperature !== '--' ? `${drive.temperature}°C` : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
