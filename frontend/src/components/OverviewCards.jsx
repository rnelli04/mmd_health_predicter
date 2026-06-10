import { Shield, Thermometer, BrainCircuit, HardDrive } from 'lucide-react';

function getHealthColor(score) {
  if (score >= 90) return { bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20', icon: 'text-success-400' };
  if (score >= 75) return { bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20', icon: 'text-warning-400' };
  if (score >= 50) return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: 'text-orange-400' };
  return { bg: 'bg-danger-500/10', text: 'text-danger-400', border: 'border-danger-500/20', icon: 'text-danger-400' };
}

function getTempColor(temp) {
  if (temp < 40) return { bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20', icon: 'text-success-400' };
  if (temp <= 50) return { bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20', icon: 'text-warning-400' };
  return { bg: 'bg-danger-500/10', text: 'text-danger-400', border: 'border-danger-500/20', icon: 'text-danger-400' };
}

function getRiskColor(prob) {
  if (prob < 10) return { bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20', icon: 'text-success-400' };
  if (prob < 30) return { bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20', icon: 'text-warning-400' };
  if (prob < 60) return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: 'text-orange-400' };
  return { bg: 'bg-danger-500/10', text: 'text-danger-400', border: 'border-danger-500/20', icon: 'text-danger-400' };
}

function Card({ icon: Icon, title, value, subtext, colors, loading }) {
  return (
    <div className={`glass-card rounded-2xl p-5 border ${colors.border} transition-all hover:border-opacity-30`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-400 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 rounded shimmer" />
          ) : (
            <>
              <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
              {subtext && (
                <p className={`text-xs font-medium mt-1 ${colors.text} opacity-80`}>{subtext}</p>
              )}
            </>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}

export default function OverviewCards({ summary, loading }) {
  const health = summary?.health;
  const ml = summary?.mlPrediction;
  const temp = summary?.temperature;
  const driveType = summary?.driveType;

  const healthColors = getHealthColor(health?.healthScore ?? 0);
  const tempColors = getTempColor(temp ?? 0);
  const riskColors = getRiskColor(ml?.failureProbability ?? 0);

  const isSSD = driveType?.includes('SSD');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={Shield}
        title="Health Score"
        value={health?.healthScore ?? '--'}
        subtext={health?.healthCategory ?? ''}
        colors={healthColors}
        loading={loading}
      />
      <Card
        icon={Thermometer}
        title="Temperature"
        value={temp !== null && temp !== undefined ? `${temp}°C` : '--'}
        subtext={temp !== null && temp !== undefined ? (temp < 40 ? 'Optimal' : temp <= 50 ? 'Elevated' : 'Critical') : ''}
        colors={tempColors}
        loading={loading}
      />
      <Card
        icon={BrainCircuit}
        title="Failure Risk"
        value={ml?.failureProbability !== undefined ? `${ml.failureProbability}%` : '--'}
        subtext={ml?.prediction === 1 ? 'At Risk' : ml?.prediction === 0 ? 'Healthy' : 'Not Available'}
        colors={riskColors}
        loading={loading}
      />
      <Card
        icon={HardDrive}
        title="Drive Type"
        value={driveType ?? '--'}
        subtext={isSSD ? 'Solid State Drive' : 'Hard Disk Drive'}
        colors={{ bg: 'bg-primary-500/10', text: 'text-primary-400', border: 'border-primary-500/20', icon: 'text-primary-400' }}
        loading={loading}
      />
    </div>
  );
}
