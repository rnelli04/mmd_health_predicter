import { Download, FileText } from 'lucide-react';

export default function ExportReport({ summary }) {
  if (!summary) return null;

  const handleExport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      drive: {
        model: summary.model,
        device: summary.device,
        type: summary.driveType,
      },
      health: {
        score: summary.health?.healthScore,
        category: summary.health?.healthCategory,
      },
      temperature: summary.temperature,
      mlPrediction: summary.mlPrediction,
      alerts: summary.health?.alerts || [],
      metrics: summary.driveType?.includes('SSD') ? {
        availableSpare: summary.availableSpare,
        percentageUsed: summary.percentageUsed,
        enduranceRemaining: summary.enduranceRemaining,
        unsafeShutdowns: summary.unsafeShutdowns,
        dataUnitsWritten: summary.dataUnitsWritten,
      } : {
        reallocatedSectors: summary.reallocatedSectors,
        pendingSectors: summary.pendingSectors,
        crcErrorCount: summary.crcErrorCount,
        startStopCount: summary.startStopCount,
        powerCycleCount: summary.powerCycleCount,
        powerOnHours: summary.powerOnHours,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drive-report-${summary.model?.replace(/\s+/g, '-') || 'unknown'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-primary-400" />
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
          Export Report
        </h3>
      </div>
      <p className="text-sm text-neutral-400 mb-4">
        Download a complete diagnostic report with all SMART data, health scores, and predictions.
      </p>
      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors text-sm font-medium"
      >
        <Download className="w-4 h-4" />
        Download JSON Report
      </button>
    </div>
  );
}
