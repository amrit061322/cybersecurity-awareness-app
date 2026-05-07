import { useEffect, useState } from 'react';
import UploadDetector from '../components/UploadDetector';
import DetectionResultCard from '../components/DetectionResultCard';
import DetectionHistoryList from '../components/DetectionHistoryList';
import ProgressBar from '../components/ProgressBar';
import { fetchDetectionHistory, scanPhishing } from '../services/phishingService';

const DetectPhishing = () => {
  const [inputType, setInputType] = useState('email');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyMeta, setHistoryMeta] = useState({ detectionAccuracy: 0, badgeLevel: 'Beginner' });
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await fetchDetectionHistory({ limit: 6 });
      setHistory(data.results || []);
      setHistoryMeta({
        detectionAccuracy: data.detectionAccuracy || 0,
        badgeLevel: data.badgeLevel || 'Beginner'
      });
    } catch (err) {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleScan = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await scanPhishing({
        inputType,
        text,
        url,
        file
      });
      setResult(response.detection);
      setHistoryMeta({
        detectionAccuracy: response.detectionAccuracy || 0,
        badgeLevel: response.badgeLevel || historyMeta.badgeLevel
      });
      await loadHistory();
      if (inputType !== 'image') {
        setText('');
        setUrl('');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-10 space-y-8 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?phishing,security')" }}
    >
      <header className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="section-title">Phishing Detection Lab</h1>
            <p className="text-on-surface-variant">Scan suspicious messages, URLs, or screenshots with hybrid detection signals.</p>
          </div>
          <div className="bg-surface-container-low/60 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface-variant">
            <p>Detection Accuracy</p>
            <p className="text-on-surface font-semibold">{historyMeta.detectionAccuracy}%</p>
            <p className="text-primary-container text-xs">Badge: {historyMeta.badgeLevel}</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={historyMeta.detectionAccuracy} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <section className="space-y-6">
          <form onSubmit={handleScan} className="glass-panel p-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              {['email', 'url', 'image'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-4 py-2 rounded-xl border text-sm ${inputType === type ? 'border-primary-container text-on-surface' : 'border-outline-variant/30 text-on-surface-variant'}`}
                  onClick={() => setInputType(type)}
                >
                  {type === 'email' && 'Paste Email Text'}
                  {type === 'url' && 'Suspicious URL'}
                  {type === 'image' && 'Upload Screenshot'}
                </button>
              ))}
            </div>

            {inputType === 'email' && (
              <textarea
                className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 w-full min-h-[160px] text-on-surface"
                placeholder="Paste the email body or SMS text here..."
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            )}

            {inputType === 'url' && (
              <input
                className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 w-full text-on-surface"
                placeholder="https://suspicious-site.com/verify"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            )}

            {inputType === 'image' && <UploadDetector file={file} onFileChange={setFile} />}

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="cyber-button" disabled={loading}>
              {loading ? 'Scanning...' : 'Run Detection'}
            </button>
          </form>

          <DetectionResultCard result={result} loading={loading} />
        </section>

        <aside className="glass-panel p-6 space-y-4">
          <div>
            <h2 className="font-headline text-on-surface text-xl">Recent Scans</h2>
            <p className="text-on-surface-variant text-sm">Track your last phishing detections.</p>
          </div>
          {historyLoading ? (
            <p className="text-on-surface-variant">Loading history...</p>
          ) : (
            <DetectionHistoryList history={history} />
          )}
        </aside>
      </div>
    </div>
  );
};

export default DetectPhishing;
