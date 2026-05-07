const CyberTip = ({ tip }) => {
  return (
    <div className="flex items-start gap-3 bg-surface-container-low/70 border border-outline-variant/20 rounded-xl p-4">
      <div className="w-2 h-2 rounded-full bg-primary-container mt-2" />
      <p className="text-on-surface text-sm">{tip}</p>
    </div>
  );
};

export default CyberTip;
