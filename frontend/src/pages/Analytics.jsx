import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchUserAnalytics, fetchAdminAnalytics } from '../services/analyticsService';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [scope, setScope] = useState('user');
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async (nextScope) => {
    setLoading(true);
    try {
      const response = nextScope === 'admin' ? await fetchAdminAnalytics() : await fetchUserAnalytics();
      setAnalytics(response.analytics);
    } catch (error) {
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(scope);
  }, [scope]);

  const scanData = useMemo(() => {
    if (!analytics) return null;
    return {
      labels: ['Phishing', 'Suspicious', 'Safe'],
      datasets: [
        {
          data: [analytics.scans.phishing, analytics.scans.suspicious, analytics.scans.safe],
          backgroundColor: ['#ffb4ab', '#d1bcff', '#00e290']
        }
      ]
    };
  }, [analytics]);

  const scamTypeData = useMemo(() => {
    if (!analytics) return null;
    return {
      labels: analytics.scamTypes.map((item) => item.type.replace('_', ' ')),
      datasets: [
        {
          label: 'Reports',
          data: analytics.scamTypes.map((item) => item.count),
          backgroundColor: '#00f0ff'
        }
      ]
    };
  }, [analytics]);

  const communityData = useMemo(() => {
    if (!analytics) return null;
    return {
      labels: ['Posts', 'Comments', 'Likes'],
      datasets: [
        {
          label: 'Engagement',
          data: [analytics.community.posts, analytics.community.comments, analytics.community.likes],
          backgroundColor: '#00dbe9'
        }
      ]
    };
  }, [analytics]);

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-10 space-y-8 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,analytics')" }}
    >
      <header className="glass-panel p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="section-title">Scam Reporting Analytics</h1>
          <p className="text-on-surface-variant">Visualize phishing scans, community engagement, and scam trends.</p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-xl border text-sm ${scope === 'user' ? 'border-primary-container text-on-surface' : 'border-outline-variant/30 text-on-surface-variant'}`}
              onClick={() => setScope('user')}
            >
              My Stats
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-xl border text-sm ${scope === 'admin' ? 'border-primary-container text-on-surface' : 'border-outline-variant/30 text-on-surface-variant'}`}
              onClick={() => setScope('admin')}
            >
              Global Stats
            </button>
          </div>
        )}
      </header>

      {loading && <div className="glass-panel p-6">Loading analytics...</div>}

      {!loading && analytics && (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <section className="space-y-6">
            <div className="glass-panel p-6">
              <h2 className="font-headline text-on-surface text-xl mb-4">Scan Outcomes</h2>
              <Doughnut data={scanData} />
              <p className="text-on-surface-variant text-sm mt-4">
                Fake detection rate: <span className="text-primary-container">{analytics.scans.fakeDetectionRate}%</span>
              </p>
            </div>
            <div className="glass-panel p-6">
              <h2 className="font-headline text-on-surface text-xl mb-4">Scam Type Reports</h2>
              {analytics.scamTypes.length > 0 ? <Bar data={scamTypeData} /> : <p className="text-on-surface-variant">No reports yet.</p>}
            </div>
          </section>
          <aside className="space-y-6">
            <div className="glass-panel p-6">
              <h2 className="font-headline text-on-surface text-xl mb-4">Community Engagement</h2>
              <Bar data={communityData} />
            </div>
            <div className="glass-panel p-6 text-sm text-on-surface-variant space-y-2">
              <p>Total Scans: <span className="text-on-surface font-semibold">{analytics.scans.total}</span></p>
              <p>Phishing Flagged: <span className="text-on-surface font-semibold">{analytics.scans.phishing}</span></p>
              <p>Suspicious Items: <span className="text-on-surface font-semibold">{analytics.scans.suspicious}</span></p>
              <p>Safe Items: <span className="text-on-surface font-semibold">{analytics.scans.safe}</span></p>
            </div>
          </aside>
        </div>
      )}

      {!loading && !analytics && (
        <div className="glass-panel p-6 text-on-surface-variant">Unable to load analytics.</div>
      )}
    </div>
  );
};

export default Analytics;
