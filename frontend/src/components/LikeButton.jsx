const LikeButton = ({ liked, count, onClick }) => {
  return (
    <button type="button" className="flex items-center gap-2 group/btn" onClick={onClick}>
      <span
        className={`material-symbols-outlined text-base transition-transform group-hover/btn:scale-110 ${
          liked ? 'text-secondary' : 'text-outline group-hover/btn:text-cyan-400'
        }`}
      >
        rocket_launch
      </span>
      <span
        className={`font-label text-xs uppercase tracking-widest ${
          liked ? 'text-secondary-fixed-dim' : 'text-outline group-hover/btn:text-cyan-400'
        }`}
      >
        Disseminate · {count}
      </span>
    </button>
  );
};

export default LikeButton;

