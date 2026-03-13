const QuizCard = ({ question, options, selected, onSelect }) => {
  return (
    <div className="glass-panel p-6 card-hover">
      <h3 className="font-display text-xl text-white mb-4">{question}</h3>
      <div className="grid gap-3">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onSelect(index)}
            className={`text-left px-4 py-3 rounded-xl border transition-all ${
              selected === index
                ? 'border-cyber-400 bg-cyber-400/10 text-white'
                : 'border-white/10 bg-base-800/40 text-slate-200 hover:border-cyber-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;
