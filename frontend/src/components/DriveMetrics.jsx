import { Thermometer, Shield, Clock, TriangleAlert as AlertTriangle, Hash, Search, RotateCcw, Power, ChartBar as BarChart3, HardDrive, Cpu, Battery, Percent, Zap, Database, ArrowDownUp } from 'lucide-react';

export default function DriveMetrics({ summary }) {
  const isSSD = summary?.driveType?.includes('SSD');
  const isHDD = summary?.driveType?.includes('HDD');

  if (isSSD) {
    return <SSDMetrics summary={summary} />;
  }

  return <HDDMetrics summary={summary} />;
}

function MetricItem({ icon: Icon, label, value, unit, color = 'neutral' }) {
  const colorMap = {
    neutral: 'text-neutral-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    danger: 'text-danger-400',
    primary: 'text-primary-400',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${colorMap[color]}`} />
        </div>
        <span className="text-sm text-neutral-400">{label}</span>
      </div>
      <span className="text-sm font-semibold text-neutral-100">
        {value}{unit ? ` ${unit}` : ''}
      </span>
    </div>
  );
}

function HDDMetrics({ summary }) {
  const s = summary || {};

  const tempColor = s.temperature > 50 ? 'danger' : s.temperature > 40 ? 'warning' : 'success';
  const healthColor = s.health?.healthScore >= 90 ? 'success' : s.health?.healthScore >= 75 ? 'warning' : s.health?.healthScore >= 50 ? 'warning' : 'danger';
  const reallocColor = s.reallocatedSectors > 10 ? 'danger' : s.reallocatedSectors > 0 ? 'warning' : 'success';
  const pendingColor = s.pendingSectors > 0 ? 'danger' : 'success';
  const crcColor = s.crcErrorCount > 100 ? 'danger' : s.crcErrorCount > 0 ? 'warning' : 'success';

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          HDD Metrics
        </h3>
      </div>
      <div className="space-y-2">
        <MetricItem icon={Thermometer} label="Temperature" value={s.temperature ?? '--'} unit="°C" color={tempColor} />
        <MetricItem icon={Shield} label="Health Score" value={s.health?.healthScore ?? '--'} color={healthColor} />
        <MetricItem icon={Clock} label="Power On Hours" value={s.powerOnHours?.toLocaleString() ?? '--'} />
        <MetricItem icon={AlertTriangle} label="Reallocated Sectors" value={s.reallocatedSectors ?? 0} color={reallocColor} />
        <MetricItem icon={Hash} label="Pending Sectors" value={s.pendingSectors ?? 0} color={pendingColor} />
        <MetricItem icon={BarChart3} label="CRC Errors" value={s.crcErrorCount ?? 0} color={crcColor} />
        <MetricItem icon={BrainIcon} label="Failure Probability" value={s.mlPrediction?.failureProbability !== undefined ? `${s.mlPrediction.failureProbability}%` : '--'} color={s.mlPrediction?.failureProbability > 30 ? 'danger' : s.mlPrediction?.failureProbability > 10 ? 'warning' : 'success'} />
      </div>
    </div>
  );
}

function SSDMetrics({ summary }) {
  const s = summary || {};

  const tempColor = s.temperature > 60 ? 'danger' : s.temperature > 50 ? 'warning' : 'success';
  const healthColor = s.health?.healthScore >= 90 ? 'success' : s.health?.healthScore >= 75 ? 'warning' : s.health?.healthScore >= 50 ? 'warning' : 'danger';
  const spareColor = s.availableSpare < 10 ? 'danger' : s.availableSpare < 20 ? 'warning' : 'success';
  const usedColor = s.percentageUsed > 80 ? 'danger' : s.percentageUsed > 60 ? 'warning' : 'success';

  const endurance = s.enduranceRemaining !== null && s.enduranceRemaining !== undefined ? `${s.enduranceRemaining}%` : '--';
  const dataWritten = s.dataUnitsWritten ? formatBytes(s.dataUnitsWritten * 512000) : '--';

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          SSD Metrics
        </h3>
      </div>
      <div className="space-y-2">
        <MetricItem icon={Thermometer} label="Temperature" value={s.temperature ?? '--'} unit="°C" color={tempColor} />
        <MetricItem icon={Shield} label="Health Score" value={s.health?.healthScore ?? '--'} color={healthColor} />
        <MetricItem icon={Battery} label="Available Spare" value={s.availableSpare ?? '--'} unit="%" color={spareColor} />
        <MetricItem icon={Percent} label="Percentage Used" value={s.percentageUsed ?? '--'} unit="%" color={usedColor} />
        <MetricItem icon={Zap} label="Endurance Remaining" value={endurance} color={parseFloat(endurance) < 20 ? 'danger' : parseFloat(endurance) < 50 ? 'warning' : 'success'} />
        <MetricItem icon={ArrowDownUp} label="Unsafe Shutdowns" value={s.unsafeShutdowns ?? 0} color={s.unsafeShutdowns > 100 ? 'warning' : 'success'} />
        <MetricItem icon={Database} label="Data Units Written" value={dataWritten} />
      </div>
    </div>
  );
}

function BrainIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function formatBytes(bytes) {
  if (bytes === 0 || bytes === undefined || bytes === null) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
