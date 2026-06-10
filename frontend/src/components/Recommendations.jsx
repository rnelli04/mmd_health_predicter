import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Lightbulb } from 'lucide-react';

function generateRecommendations(summary) {
  const recs = [];
  const isSSD = summary?.driveType?.includes('SSD');
  const healthScore = summary?.health?.healthScore ?? 0;
  const alerts = summary?.health?.alerts || [];
  const hasCritical = alerts.some(a => a.severity === 'critical');
  const hasWarning = alerts.some(a => a.severity === 'warning');

  if (hasCritical) {
    recs.push({
      type: 'critical',
      text: 'Backup important data immediately. Critical issues detected.',
    });
  }

  if (hasWarning) {
    recs.push({
      type: 'warning',
      text: 'Monitor SMART values weekly. Warning signs present.',
    });
  }

  if (healthScore < 50) {
    recs.push({
      type: 'critical',
      text: 'Drive health is critical. Consider replacing soon.',
    });
  } else if (healthScore < 75) {
    recs.push({
      type: 'warning',
      text: 'Drive health is declining. Schedule regular backups.',
    });
  }

  if (isSSD) {
    const used = summary?.percentageUsed ?? 0;
    if (used > 80) {
      recs.push({
        type: 'warning',
        text: 'SSD endurance is nearly exhausted. Plan for replacement.',
      });
    } else if (used > 60) {
      recs.push({
        type: 'info',
        text: 'SSD wear level is increasing. Monitor usage patterns.',
      });
    } else {
      recs.push({
        type: 'success',
        text: 'SSD endurance is excellent. No action required.',
      });
    }

    const unsafe = summary?.unsafeShutdowns ?? 0;
    if (unsafe > 100) {
      recs.push({
        type: 'warning',
        text: 'High unsafe shutdown count. Use UPS or proper shutdown.',
      });
    }
  } else {
    const temp = summary?.temperature ?? 0;
    if (temp > 50) {
      recs.push({
        type: 'warning',
        text: 'Drive temperature is high. Improve cooling/airflow.',
      });
    }

    const pending = summary?.pendingSectors ?? 0;
    if (pending > 0) {
      recs.push({
        type: 'critical',
        text: 'Pending sectors detected. Run full surface scan.',
      });
    }

    const realloc = summary?.reallocatedSectors ?? 0;
    if (realloc === 0 && pending === 0 && healthScore >= 75) {
      recs.push({
        type: 'success',
        text: 'Drive is in good condition. Continue regular backups.',
      });
    }
  }

  if (recs.length === 0) {
    recs.push({
      type: 'success',
      text: 'All systems normal. Keep up regular backups.',
    });
  }

  return recs;
}

const typeConfig = {
  success: {
    icon: CheckCircle2,
    text: 'text-success-400',
    bg: 'bg-success-500/5',
    border: 'border-success-500/10',
  },
  warning: {
    icon: AlertCircle,
    text: 'text-warning-400',
    bg: 'bg-warning-500/5',
    border: 'border-warning-500/10',
  },
  critical: {
    icon: AlertCircle,
    text: 'text-danger-400',
    bg: 'bg-danger-500/5',
    border: 'border-danger-500/10',
  },
  info: {
    icon: Lightbulb,
    text: 'text-info-400',
    bg: 'bg-info-500/5',
    border: 'border-info-500/10',
  },
};

export default function Recommendations({ summary }) {
  const recs = generateRecommendations(summary);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Recommendations
        </h3>
      </div>
      <div className="space-y-2">
        {recs.map((rec, idx) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
            >
              <Icon className={`w-4 h-4 ${config.text} shrink-0 mt-0.5`} />
              <p className={`text-sm ${config.text} leading-relaxed`}>{rec.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
