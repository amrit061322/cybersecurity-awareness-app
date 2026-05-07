import { useState } from 'react';

const CommentBox = ({ comments, onSubmit, loading, onLoad }) => {
  const [value, setValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    const success = await onSubmit(value);
    if (success) {
      setValue('');
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <button type="button" className="font-label text-[10px] text-outline uppercase tracking-widest" onClick={onLoad}>
        Refresh comments
      </button>
      <div className="space-y-2">
        {comments.length === 0 && <p className="text-on-surface-variant text-sm">No comments yet.</p>}
        {comments.map((comment) => (
          <div key={comment._id} className="bg-surface-container-low/60 border border-outline-variant/20 rounded-xl px-3 py-2">
            <p className="text-on-surface text-sm">{comment.content}</p>
            <p className="text-outline text-xs">
              {comment.author?.name || 'Anonymous'} · {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 text-on-surface"
          placeholder="Write a comment..."
        />
        <button type="submit" className="px-4 py-2 rounded-xl border border-primary-container/30 text-primary-container font-label text-xs uppercase tracking-widest" disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default CommentBox;

