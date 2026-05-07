import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../services/api";
import ProgressBar from "../components/ProgressBar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/users/profile");
        console.log("DASHBOARD API:", res.data);

        const userData = res.data.user || res.data;

        setProfile(userData);
        setHistory(res.data.quiz_history || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  if (!profile || !profile.name) {
    return <p className="p-6 text-white">Loading dashboard...</p>;
  }

  const avatar = profile.photoURL || profile.profile_picture;
  const latestScore = history[0]?.percentage || 0;

  const chartData = {
    labels: history.slice(0, 6).map((i) =>
      new Date(i.date_attempted).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Performance",
        data: history.slice(0, 6).map((i) => i.percentage),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.2)",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400">
          {avatar ? (
            <img src={avatar} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {profile.name}
          </h1>
          <p className="text-slate-400 text-sm">
            {profile.awareness_level || "User"}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Avg Score" value={`${profile.average_score || 0}%`} />
        <StatCard label="Latest" value={`${latestScore}%`} />
        <StatCard label="Attempts" value={profile.quiz_attempts || 0} />
        <StatCard label="Level" value={profile.awareness_level || "N/A"} />
      </div>

      {/* PROGRESS */}
      <div className="bg-[#0f172a] p-6 rounded-xl border border-white/5">
        <h2 className="text-white mb-3">Overall Progress</h2>
        <ProgressBar value={profile.average_score || 0} />
      </div>

      {/* CHART */}
      <div className="bg-[#0f172a] p-6 rounded-xl border border-white/5">
        <h2 className="text-white mb-4">Performance Trend</h2>
        {history.length ? (
          <Line data={chartData} />
        ) : (
          <p className="text-slate-400">No quiz data yet</p>
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-[#0f172a] p-6 rounded-xl border border-white/5">
        <h2 className="text-white mb-4">Recent Activity</h2>

        {history.length === 0 && (
          <p className="text-slate-400">No recent activity</p>
        )}

        {history.slice(0, 3).map((item) => (
          <div key={item._id} className="flex justify-between py-2 border-b border-white/5">
            <span className="text-slate-300">{item.topic}</span>
            <span className="text-cyan-400">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5">
    <p className="text-slate-400 text-xs">{label}</p>
    <p className="text-white text-lg font-semibold">{value}</p>
  </div>
);

export default Dashboard;