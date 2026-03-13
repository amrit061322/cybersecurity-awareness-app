import { useState } from 'react';
import api from '../services/api';

const FeedbackForm = () => {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus('loading');
      await api.post('/feedback', form);
      setStatus('success');
      setForm({ name: '', email: '', rating: 5, message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
      <h3 className="font-display text-xl text-white">Share Feedback</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          placeholder="Your name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          placeholder="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <select
          className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2"
          name="rating"
          value={form.rating}
          onChange={handleChange}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              Rating: {rating}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="bg-base-800/60 border border-white/10 rounded-xl px-3 py-2 min-h-[120px]"
        placeholder="Tell us what to improve"
        name="message"
        value={form.message}
        onChange={handleChange}
        required
      />
      <button type="submit" className="cyber-button">Submit Feedback</button>
      {status === 'success' && <p className="text-cyber-300 text-sm">Thanks for your feedback.</p>}
      {status === 'error' && <p className="text-red-400 text-sm">Unable to send feedback.</p>}
    </form>
  );
};

export default FeedbackForm;
