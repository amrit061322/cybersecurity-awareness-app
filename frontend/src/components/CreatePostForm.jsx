import { useState } from 'react';
import ImageUploader from './ImageUploader';

const CreatePostForm = ({ onCreate, loading }) => {
  const [content, setContent] = useState('');
  const [scamType, setScamType] = useState('phishing');
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    const success = await onCreate({ content, scamType, file });
    if (success) {
      setContent('');
      setFile(null);
      setScamType('phishing');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-outline-variant/20 shadow-[0_0_30px_rgba(0,240,255,0.08)]">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-12 h-12 rounded-xl border border-primary-container/40 bg-surface-container-highest flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined">edit</span>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-primary-fixed-dim">
              Initialize New Broadcast
            </p>
            <h2 className="font-headline text-on-surface text-xl">Share a Scam Story</h2>
            <p className="text-on-surface-variant text-sm">Help the community learn from real experiences.</p>
          </div>

          <textarea
            className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-4 py-3 w-full min-h-[140px] text-on-surface"
            placeholder="Log intel or technical updates..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <ImageUploader file={file} onChange={setFile} />
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  Scam Type
                </label>
                <select
                  className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface text-xs"
                  value={scamType}
                  onChange={(event) => setScamType(event.target.value)}
                >
                  <option value="phishing">Phishing</option>
                  <option value="otp_fraud">OTP Fraud</option>
                  <option value="fake_investment">Fake Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border border-primary-container/40 text-primary-container font-label text-xs tracking-widest uppercase hover:bg-primary-container/10 transition-colors"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post_Intel'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePostForm;

