import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
        <h1 className="font-display text-2xl text-white">Create Account</h1>
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          required
        />
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          required
        />
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password (8+ characters)"
          required
        />
        <button type="submit" className="cyber-button w-full">Register</button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <p className="text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-cyber-300">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
