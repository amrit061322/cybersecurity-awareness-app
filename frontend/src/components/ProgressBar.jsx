const ProgressBar = ({ value }) => {
  const safeValue = Math.min(100, Math.max(0, value || 0));
  return (
    <div className="w-full bg-surface-container-highest/80 rounded-full h-3 border border-outline-variant/20 overflow-hidden">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-primary-container to-secondary-container transition-all"
        style={{ width: `${safeValue}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
