import { Clock, HardDrive } from 'lucide-react';

export default function Footer({ lastUpdated, selectedDevice, model }) {
  return (
    <footer className="mt-8 mb-4 glass-card rounded-2xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-500">Last Updated:</span>
            <span className="text-neutral-300 font-mono text-xs">
              {lastUpdated ? lastUpdated.toLocaleString() : '--'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-500">Selected Drive:</span>
            <span className="text-neutral-300 font-medium">{model || selectedDevice || '--'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
