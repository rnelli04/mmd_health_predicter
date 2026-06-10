import { Cpu, Clock, Power, RotateCcw } from 'lucide-react';

export default function DriveInfo({ summary }) {
  const isSSD = summary?.driveType?.includes('SSD');

  const items = [
    {
      icon: Cpu,
      label: 'Model',
      value: summary?.model || 'Unknown',
    },
    {
      icon: isSSD ? Cpu : HardDriveIcon,
      label: 'Drive Type',
      value: summary?.driveType || 'Unknown',
    },
    {
      icon: Clock,
      label: 'Power On Hours',
      value: summary?.powerOnHours?.toLocaleString() ?? '--',
    },
    {
      icon: RotateCcw,
      label: 'Start Stop Count',
      value: !isSSD ? (summary?.startStopCount?.toLocaleString() ?? '--') : 'N/A',
    },
    {
      icon: Power,
      label: 'Power Cycle Count',
      value: summary?.powerCycleCount?.toLocaleString() ?? '--',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
        Drive Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-500">{item.label}</p>
              <p className="text-sm font-medium text-neutral-100 truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HardDriveIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" x2="2" y1="12" y2="12" />
      <path d="M20.5 12a8.5 8.5 0 1 0-17 0 8.5 8.5 0 0 0 17 0Z" />
      <path d="M12 12v4" />
      <path d="M12 16h4" />
    </svg>
  );
}
