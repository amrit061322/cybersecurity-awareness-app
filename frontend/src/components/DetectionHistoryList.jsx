const statusStyles = {
  safe: 'text-tertiary-fixed-dim',
  suspicious: 'text-secondary',
  phishing: 'text-error'
};

const DetectionHistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-on-surface-variant">No scans yet. Your recent scans will appear here.</p>;
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div key={item._id} className="bg-surface-container-low/60 border border-outline-variant/20 rounded-xl p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-on-surface text-sm break-all">
                {item.contentSnippet || 'Scan result'}
              </p>
              <p className="text-on-surface-variant text-xs">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-xs uppercase tracking-widest ${statusStyles[item.resultStatus] || 'text-slate-300'}`}>
                {item.resultStatus}
              </p>
              <p className="text-on-surface text-sm">{item.confidenceScore}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetectionHistoryList;
