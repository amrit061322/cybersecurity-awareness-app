const CyberTip = ({ tip }) => {
  return (
    <div className="flex items-start gap-3 bg-base-800/70 border border-white/10 rounded-xl p-4">
      <div className="w-2 h-2 rounded-full bg-cyber-400 mt-2" />
      <p className="text-slate-200 text-sm">{tip}</p>
    </div>
  );
};

export default CyberTip;
