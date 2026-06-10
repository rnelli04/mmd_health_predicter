import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info } from 'lucide-react';

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-danger-500/10',
    border: 'border-danger-500/20',
    text: 'text-danger-400',
    iconBg: 'bg-danger-500/15',
    label: 'Critical',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-warning-500/10',
    border: 'border-warning-500/20',
    text: 'text-warning-400',
    iconBg: 'bg-warning-500/15',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bg: 'bg-info-500/10',
    border: 'border-info-500/20',
    text: 'text-info-400',
    iconBg: 'bg-info-500/15',
    label: 'Info',
  },
};

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
          Alerts
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-success-500/10 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-neutral-400">No alerts</p>
          <p className="text-xs text-neutral-500 mt-1">All systems normal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Alerts
        </h3>
        <span className="px-2 py-0.5 text-xs font-medium bg-danger-500/10 text-danger-400 rounded-full">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {alerts.map((alert, idx) => {
          const config = severityConfig[alert.severity] || severityConfig.info;
          const Icon = config.icon;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
            >
              <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wide ${config.text} mb-0.5`}>
                  {config.label}
                </p>
                <p className="text-sm text-neutral-200 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
