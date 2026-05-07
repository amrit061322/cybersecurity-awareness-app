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
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4 border border-outline-variant/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl border border-primary-container/40 bg-surface-container-highest flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined">forum</span>
        </div>
        <div>
          <p className="font-label text-xs uppercase tracking-widest text-primary-fixed-dim">Feedback Channel</p>
          <h3 className="font-headline text-xl text-on-surface">Share Feedback</h3>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
          placeholder="Your name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
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
          className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
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
        className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 min-h-[120px] text-on-surface"
        placeholder="Tell us what to improve"
        name="message"
        value={form.message}
        onChange={handleChange}
        required
      />
      <button type="submit" className="cyber-button">Submit Feedback</button>
      {status === 'success' && <p className="text-primary-container text-sm">Thanks for your feedback.</p>}
      {status === 'error' && <p className="text-red-400 text-sm">Unable to send feedback.</p>}
    </form>
  );
};

export default FeedbackForm;
