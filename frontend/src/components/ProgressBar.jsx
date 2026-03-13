const ProgressBar = ({ value }) => {
  const safeValue = Math.min(100, Math.max(0, value || 0));
  return (
    <div className="w-full bg-base-700/70 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-cyber-400 to-neon-500 transition-all"
        style={{ width: `${safeValue}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
