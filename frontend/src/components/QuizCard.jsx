const QuizCard = ({ question, options, selected, onSelect }) => {
  return (
    <div className="glass-panel p-6 card-hover">
      <h3 className="font-headline text-xl text-on-surface mb-4">{question}</h3>
      <div className="grid gap-3">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onSelect(index)}
            className={`text-left px-4 py-3 rounded-xl border transition-all ${
              selected === index
                ? 'border-primary-container bg-primary-container/10 text-on-surface'
                : 'border-outline-variant/30 bg-surface-container-low/40 text-on-surface hover:border-primary-container'
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
