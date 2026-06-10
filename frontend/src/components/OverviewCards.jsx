import { Shield, Thermometer, BrainCircuit, HardDrive, Battery, TriangleAlert as AlertTriangle, Zap, Hash } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function getHealthColor(score) {
  if (score >= 90) return { color: '#4ade80', bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20', icon: 'text-success-400' };
  if (score >= 75) return { color: '#fbbf24', bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20', icon: 'text-warning-400' };
  if (score >= 50) return { color: '#fb923c', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: 'text-orange-400' };
  return { color: '#f87171', bg: 'bg-danger-500/10', text: 'text-danger-400', border: 'border-danger-500/20', icon: 'text-danger-400' };
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

function getSpareColor(spare) {
  if (spare >= 80) return { bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20', icon: 'text-success-400' };
  if (spare >= 50) return { bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20', icon: 'text-warning-400' };
  return { bg: 'bg-danger-500/10', text: 'text-danger-400', border: 'border-danger-500/20', icon: 'text-danger-400' };
}

function getEnduranceColor(endurance) {
  if (endurance >= 80) return { bg: 'bg-success-500/10', text: 'text-success-400', border: 'border-success-500/20', icon: 'text-success-400' };
  if (endurance >= 50) return { bg: 'bg-warning-500/10', text: 'text-warning-400', border: 'border-warning-500/20', icon: 'text-warning-400' };
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

function HealthGaugeCard({ score, category, loading }) {
  const colors = getHealthColor(score ?? 0);

  return (
    <div className={`glass-card rounded-2xl p-5 border ${colors.border} transition-all hover:border-opacity-30`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-400 mb-3">Health Score</p>
          {loading ? (
            <div className="h-8 w-24 rounded shimmer" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={score ?? 0}
                  text={`${score ?? '--'}`}
                  styles={buildStyles({
                    textSize: '28px',
                    pathColor: colors.color,
                    textColor: colors.color,
                    trailColor: 'rgba(148, 163, 184, 0.15)',
                  })}
                />
              </div>
              <div>
                <p className={`text-lg font-bold ${colors.text}`}>{category || 'Unknown'}</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {score >= 90 ? 'Excellent condition' : score >= 75 ? 'Monitor closely' : score >= 50 ? 'Declining health' : 'Critical - replace soon'}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Shield className={`w-5 h-5 ${colors.icon}`} />
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
  const spareColors = getSpareColor(summary?.availableSpare ?? 100);
  const enduranceColors = getEnduranceColor(summary?.enduranceRemaining ?? 100);

  const isSSD = driveType?.includes('SSD');
  const isHDD = driveType?.includes('HDD');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <HealthGaugeCard
        score={health?.healthScore}
        category={health?.healthCategory}
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

      {isSSD ? (
        <>
          <Card
            icon={Zap}
            title="Endurance Remaining"
            value={summary?.enduranceRemaining !== null && summary?.enduranceRemaining !== undefined ? `${summary.enduranceRemaining}%` : '--'}
            subtext={summary?.enduranceRemaining >= 80 ? 'Excellent' : summary?.enduranceRemaining >= 50 ? 'Good' : 'Degraded'}
            colors={enduranceColors}
            loading={loading}
          />
          <Card
            icon={Battery}
            title="Available Spare"
            value={summary?.availableSpare !== null && summary?.availableSpare !== undefined ? `${summary.availableSpare}%` : '--'}
            subtext={summary?.availableSpare >= 80 ? 'Excellent' : summary?.availableSpare >= 50 ? 'Good' : 'Degraded'}
            colors={spareColors}
            loading={loading}
          />
        </>
      ) : (
        <>
          <Card
            icon={BrainCircuit}
            title="Failure Risk"
            value={ml?.failureProbability !== undefined ? `${ml.failureProbability}%` : 'N/A'}
            subtext={isHDD ? (ml?.prediction === 1 ? 'At Risk' : 'Healthy') : 'Not Applicable'}
            colors={riskColors}
            loading={loading}
          />
          <Card
            icon={Hash}
            title="Reallocated Sectors"
            value={summary?.reallocatedSectors ?? 0}
            subtext={summary?.reallocatedSectors > 10 ? 'Critical' : summary?.reallocatedSectors > 0 ? 'Warning' : 'Healthy'}
            colors={summary?.reallocatedSectors > 10 ? getHealthColor(30) : summary?.reallocatedSectors > 0 ? getHealthColor(60) : getHealthColor(95)}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
