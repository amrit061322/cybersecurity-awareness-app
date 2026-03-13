import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/users/profile');
      setProfile(response.data.user);
      setHistory(response.data.quiz_history || []);
    };
    fetchData();
  }, []);

  const latestScore = history[0]?.percentage || 0;
  const chartData = {
    labels: history.map((item) => new Date(item.date_attempted).toLocaleDateString()),
    datasets: [
      {
        label: 'Quiz Score %',
        data: history.map((item) => item.percentage),
        borderColor: '#5ef2d9',
        backgroundColor: 'rgba(94, 242, 217, 0.2)'
      }
    ]
  };

  if (!profile) {
    return <p className="text-slate-300 px-4 py-10">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl text-white">Welcome back, {profile.name}</h1>
          <p className="text-slate-300">Awareness Level: <span className="text-cyber-300">{profile.awareness_level}</span></p>
        </div>
        <div className="text-slate-300">
          <p>Average Score: {profile.average_score}%</p>
          <p>Quiz Attempts: {profile.quiz_attempts}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <h2 className="font-display text-white text-xl">Progress</h2>
          <ProgressBar value={profile.average_score} />
          <p className="text-slate-300">Latest Score: {latestScore}%</p>
        </div>
        <div className="glass-panel p-6">
          <h2 className="font-display text-white text-xl mb-4">Quiz Trend</h2>
          {history.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p className="text-slate-300">No quiz history yet.</p>
          )}
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="font-display text-white text-xl mb-4">Quiz History</h2>
        <div className="grid gap-3">
          {history.length === 0 && <p className="text-slate-300">Complete a quiz to see results.</p>}
          {history.map((item) => (
            <div key={item._id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-base-800/70 rounded-xl p-4">
              <div>
                <p className="text-white font-semibold">{item.topic}</p>
                <p className="text-slate-400 text-sm">{new Date(item.date_attempted).toLocaleString()}</p>
              </div>
              <div className="text-cyber-300 font-semibold">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
