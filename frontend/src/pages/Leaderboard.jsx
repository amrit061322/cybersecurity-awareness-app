import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';

const Leaderboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLeaderboard({ limit: 20 });
        setRows(data.leaderboard || []);
      } catch (err) {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-10 space-y-6 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,leaderboard')" }}
    >
      <header className="glass-panel p-6">
        <h1 className="section-title">Awareness Leaderboard</h1>
        <p className="text-on-surface-variant">Ranked by quiz performance, detection accuracy, and community contribution.</p>
      </header>

      <div className="glass-panel p-6">
        {loading ? (
          <p className="text-on-surface-variant">Loading leaderboard...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-on-surface-variant">
              <thead>
                <tr className="text-left text-on-surface-variant">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Member</th>
                  <th className="py-2">Badge</th>
                  <th className="py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.userId} className="border-t border-outline-variant/20">
                    <td className="py-3">#{row.rank}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container overflow-hidden">
                          {row.profile_picture ? (
                            <img src={row.profile_picture} alt={row.name} className="w-full h-full object-cover" />
                          ) : (
                            row.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <p className="text-on-surface font-semibold">{row.name}</p>
                          <p className="text-xs text-on-surface-variant">{row.awareness_level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full border border-primary-container/50 text-primary-container">
                        {row.badge_level}
                      </span>
                    </td>
                    <td className="py-3 text-on-surface font-semibold">{row.awarenessScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
