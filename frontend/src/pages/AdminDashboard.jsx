import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [statsResponse, feedbackResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/feedback')
      ]);
      setStats(statsResponse.data);
      setFeedback(feedbackResponse.data.feedback || []);
    };
    fetchStats();
  }, []);

  if (!stats) {
    return <p className="text-slate-300 px-4 py-10">Loading admin analytics...</p>;
  }

  const bandLabels = stats.scoreBands.map((band) => (band._id === 'unknown' ? 'Unknown' : `${band._id}+`));
  const bandCounts = stats.scoreBands.map((band) => band.count);

  const chartData = {
    labels: bandLabels,
    datasets: [
      {
        label: 'Users per Score Band',
        data: bandCounts,
        backgroundColor: 'rgba(94, 242, 217, 0.5)'
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="font-display text-3xl text-white">{stats.totalUsers}</p>
        </div>
        <div className="glass-panel p-6">
          <p className="text-slate-400 text-sm">Quiz Attempts</p>
          <p className="font-display text-3xl text-white">{stats.totalQuizAttempts}</p>
        </div>
        <div className="glass-panel p-6">
          <p className="text-slate-400 text-sm">Average Awareness</p>
          <p className="font-display text-3xl text-white">{stats.averageAwarenessScore}%</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="font-display text-white text-xl mb-4">Awareness Distribution</h2>
          <Bar data={chartData} />
        </div>
        <div className="glass-panel p-6">
          <h2 className="font-display text-white text-xl mb-4">Leaderboard</h2>
          <div className="space-y-3">
            {stats.leaderboard.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between bg-base-800/70 rounded-xl p-3">
                <p className="text-white">#{index + 1} {user.name}</p>
                <p className="text-cyber-300">{user.average_score}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="font-display text-white text-xl mb-4">Lowest Scores</h2>
          <div className="space-y-3">
            {stats.lowestScores.map((user) => (
              <div key={user._id} className="flex items-center justify-between bg-base-800/70 rounded-xl p-3">
                <p className="text-white">{user.name}</p>
                <p className="text-red-400">{user.average_score}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h2 className="font-display text-white text-xl mb-4">Top Quiz Results</h2>
          <div className="space-y-3">
            {stats.highestScores.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between bg-base-800/70 rounded-xl p-3">
                <p className="text-white">{entry.topic}</p>
                <p className="text-cyber-300">{entry.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="font-display text-white text-xl mb-4">User Feedback</h2>
        <div className="space-y-3">
          {feedback.length === 0 && <p className="text-slate-300">No feedback submitted yet.</p>}
          {feedback.map((item) => (
            <div key={item._id} className="bg-base-800/70 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{item.name}</p>
                <p className="text-cyber-300">Rating: {item.rating}</p>
              </div>
              <p className="text-slate-300 text-sm mt-2">{item.message}</p>
              <p className="text-slate-500 text-xs mt-2">{new Date(item.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
