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
    <div
      className="max-w-md mx-auto px-4 py-16 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?secure,register')" }}
    >
      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
        <h1 className="font-headline text-2xl text-on-surface">Create Account</h1>
        <input
          className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          required
        />
        <input
          className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          required
        />
        <input
          className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password (8+ characters)"
          required
        />
        <button type="submit" className="cyber-button w-full">Register</button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <p className="text-on-surface-variant text-sm">
          Already have an account? <Link to="/login" className="text-primary-container">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
