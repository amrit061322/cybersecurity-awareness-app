import { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', profile_picture: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await api.get('/users/profile');
      setProfile(response.data.user);
      setForm({
        name: response.data.user.name,
        profile_picture: response.data.user.profile_picture || ''
      });
    };
    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await api.put('/users/update', form);
      setProfile(response.data.user);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (!profile) {
    return <p className="text-slate-300 px-4 py-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="glass-panel p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cyber-400/20 flex items-center justify-center text-cyber-300">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-display text-2xl text-white">{profile.name}</h1>
          <p className="text-slate-300">{profile.email}</p>
          <p className="text-cyber-300">{profile.awareness_level}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
        <h2 className="font-display text-white text-xl">Update Profile</h2>
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          name="profile_picture"
          value={form.profile_picture}
          onChange={handleChange}
          placeholder="Profile image URL"
        />
        <button type="submit" className="cyber-button">Save Changes</button>
        {status === 'success' && <p className="text-cyber-300 text-sm">Profile updated.</p>}
        {status === 'error' && <p className="text-red-400 text-sm">Update failed.</p>}
      </form>
    </div>
  );
};

export default Profile;
