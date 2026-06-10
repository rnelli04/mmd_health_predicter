import { TriangleAlert as AlertTriangle, ChartBar as BarChart3, TrendingUp } from 'lucide-react';

export default function FailureExplanation({ summary }) {
  const isHDD = summary?.driveType?.includes('HDD');
  const ml = summary?.mlPrediction;
  const prob = ml?.failureProbability;

  if (!isHDD || prob === undefined || prob === null) return null;

  const factors = [];

  if (summary.reportedUncorrect > 10) {
    factors.push({ label: 'Reported Uncorrectable Errors', value: summary.reportedUncorrect, threshold: 10 });
  }
  if (summary.seekErrorRate > 100) {
    factors.push({ label: 'Seek Error Rate', value: summary.seekErrorRate, threshold: 100 });
  }
  if (summary.startStopCount > 50000) {
    factors.push({ label: 'Start/Stop Count', value: summary.startStopCount, threshold: 50000 });
  }
  if (summary.reallocatedSectors > 0) {
    factors.push({ label: 'Reallocated Sectors', value: summary.reallocatedSectors, threshold: 0 });
  }
  if (summary.pendingSectors > 0) {
    factors.push({ label: 'Pending Sectors', value: summary.pendingSectors, threshold: 0 });
  }
  if (summary.spinRetryCount > 0) {
    factors.push({ label: 'Spin Retry Count', value: summary.spinRetryCount, threshold: 0 });
  }
  if (summary.rawReadErrorRate > 100) {
    factors.push({ label: 'Raw Read Error Rate', value: summary.rawReadErrorRate, threshold: 100 });
  }

  if (factors.length === 0 && prob < 10) return null;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Failure Analysis
        </h3>
      </div>

      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-danger-500/5 border border-danger-500/10">
        <div className="w-10 h-10 rounded-lg bg-danger-500/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-danger-400" />
        </div>
        <div>
          <p className="text-sm text-neutral-400">Failure Probability</p>
          <p className="text-2xl font-bold text-danger-400">{prob}%</p>
        </div>
      </div>

      {factors.length > 0 ? (
        <>
          <p className="text-sm text-neutral-400 mb-3">Main contributing factors:</p>
          <div className="space-y-2">
            {factors.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-danger-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-danger-400" />
                  </div>
                  <span className="text-sm text-neutral-300">{factor.label}</span>
                </div>
                <span className="text-sm font-semibold text-danger-400">{factor.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-neutral-400 text-center py-4">
          No critical failure factors detected. Drive is within normal parameters.
        </p>
      )}
    </div>
  );
}
