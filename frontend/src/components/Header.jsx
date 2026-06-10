import { HardDrive, RefreshCw, Activity, ChevronDown } from 'lucide-react';

export default function Header({ drives, selectedDevice, onDriveChange, onRefresh, loading }) {
  const selectedDrive = drives.find(d => d.device === selectedDevice);

  return (
    <header className="glass-card rounded-2xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-0 tracking-tight">
              Disk Health Monitoring
            </h1>
            <p className="text-sm text-neutral-400">Real-time SMART data & failure prediction</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              value={selectedDevice}
              onChange={(e) => onDriveChange(e.target.value)}
              className="pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 appearance-none cursor-pointer min-w-[240px]"
            >
              {drives.map((drive) => (
                <option key={drive.device} value={drive.device}>
                  {drive.model} ({drive.device})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-neutral-300 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 px-3 py-2 bg-success-500/10 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-success-400 pulse-dot" />
            <span className="text-xs font-medium text-success-400">Live</span>
          </div>
        </div>
      </div>

      {selectedDrive && (
        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Model:</span>
            <span className="text-neutral-200 font-medium">{selectedDrive.model}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Type:</span>
            <span className="text-neutral-200 font-medium">{selectedDrive.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Device:</span>
            <span className="text-neutral-200 font-mono text-xs">{selectedDrive.device}</span>
          </div>
        </div>
      )}
    </header>
  );
}
