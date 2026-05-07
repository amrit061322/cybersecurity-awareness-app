import ProgressBar from './ProgressBar';

const statusStyles = {
  safe: 'text-tertiary-fixed-dim',
  suspicious: 'text-secondary',
  phishing: 'text-error'
};

const DetectionResultCard = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel p-6 space-y-3">
        <div className="h-4 bg-surface-container-highest/70 rounded w-2/3" />
        <div className="h-3 bg-surface-container-highest/70 rounded" />
        <div className="h-3 bg-surface-container-highest/70 rounded w-1/2" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-panel p-6">
        <p className="text-slate-300">Run a scan to see confidence and risk details.</p>
      </div>
    );
  }

  const statusLabel = result.resultStatus?.toUpperCase() || 'SAFE';
  const statusClass = statusStyles[result.resultStatus] || 'text-slate-300';

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-on-surface-variant text-xs uppercase tracking-widest">Detection Result</p>
          <h3 className={`font-headline text-xl ${statusClass}`}>{statusLabel}</h3>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant text-xs">Confidence</p>
          <p className="text-on-surface text-lg font-semibold">{result.confidenceScore}%</p>
        </div>
      </div>
      <ProgressBar value={result.confidenceScore} />
      <div>
        <p className="text-on-surface-variant text-sm mb-2">Why this result</p>
        <ul className="space-y-2 text-sm text-on-surface">
          {(result.explanations || []).map((item, index) => (
            <li key={index} className="bg-surface-container-low/60 rounded-xl px-3 py-2 border border-outline-variant/20">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetectionResultCard;

