import { useState, useEffect, useCallback } from 'react';
import {
  getAvailableDrives,
  selectDrive,
  getSmartSummary,
  getHealthTrends,
} from '../api/smartApi';
import Header from './Header';
import OverviewCards from './OverviewCards';
import DriveInfo from './DriveInfo';
import DriveMetrics from './DriveMetrics';
import AlertsPanel from './AlertsPanel';
import Recommendations from './Recommendations';
import HealthTrendChart from './HealthTrendChart';
import TempTrendChart from './TempTrendChart';
import Footer from './Footer';

export default function Dashboard() {
  const [drives, setDrives] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDrives = useCallback(async () => {
    try {
      const data = await getAvailableDrives();
      setDrives(data);
      if (data.length > 0 && !selectedDevice) {
        setSelectedDevice(data[0].device);
      }
    } catch (err) {
      setError('Failed to fetch drives');
    }
  }, [selectedDevice]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, tr] = await Promise.all([
        getSmartSummary(),
        getHealthTrends(),
      ]);
      setSummary(sum);
      setTrends(tr);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  useEffect(() => {
    if (selectedDevice) {
      fetchDashboard();
    }
  }, [selectedDevice, fetchDashboard]);

  const handleDriveChange = async (device) => {
    setSelectedDevice(device);
    try {
      await selectDrive(device);
    } catch (err) {
      setError('Failed to select drive');
    }
  };

  const handleRefresh = () => {
    fetchDashboard();
  };

  if (error && !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="text-danger-400 text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Unable to connect</h2>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header
          drives={drives}
          selectedDevice={selectedDevice}
          onDriveChange={handleDriveChange}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {summary && (
          <>
            <OverviewCards summary={summary} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                <DriveInfo summary={summary} />
                <DriveMetrics summary={summary} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HealthTrendChart trends={trends} />
                  <TempTrendChart trends={trends} />
                </div>
              </div>
              <div className="space-y-6">
                <AlertsPanel alerts={summary.health?.alerts || []} />
                <Recommendations summary={summary} />
              </div>
            </div>

            <Footer
              lastUpdated={lastUpdated}
              selectedDevice={selectedDevice}
              model={summary.model}
            />
          </>
        )}
      </div>
    </div>
  );
}
