import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      const user = await login(form);
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check credentials.');
    }
  };

  return (
    <div
      className="max-w-md mx-auto px-4 py-16 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?secure,login')" }}
    >
      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
        <h1 className="font-headline text-2xl text-on-surface">Welcome Back</h1>
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
          placeholder="Password"
          required
        />
        <button type="submit" className="cyber-button w-full">Login</button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <p className="text-on-surface-variant text-sm">
          No account? <Link to="/register" className="text-primary-container">Create one</Link>
        </p>
      </form>

      <div className="mt-6 flex justify-center">
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (!credentialResponse?.credential) {
                setError('Google login failed');
                return;
              }
              if (import.meta.env.DEV) {
                console.log('[GoogleOAuth] credential received:', Boolean(credentialResponse.credential));
              }
              loginWithGoogle(credentialResponse.credential)
                .then((user) => navigate(user?.role === 'admin' ? '/admin' : '/dashboard'))
                .catch((err) => setError(err?.response?.data?.message || 'Google login failed'));
            }}
            onError={() => setError('Google login failed')}
          />
        ) : (
          <p className="text-slate-500 text-sm">Google login requires VITE_GOOGLE_CLIENT_ID.</p>
        )}
      </div>
    </div>
  );
};

export default Login;
