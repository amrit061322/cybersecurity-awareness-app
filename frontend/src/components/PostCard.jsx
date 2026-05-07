import { useState } from 'react';
import { getAvatarUrl } from '../pages/Profile';
import LikeButton from './LikeButton';
import CommentBox from './CommentBox';

const PostCard = ({ post, onToggleLike, onDelete, loadComments, addComment, currentUserId, highlighted = false }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLoadComments = async () => {
    setCommentLoading(true);
    const data = await loadComments(post._id);
    setComments(data);
    setCommentLoading(false);
  };

  const handleAddComment = async (content) => {
    const created = await addComment(post._id, content);
    if (created) {
      setComments((prev) => [created, ...prev]);
      return true;
    }
    return false;
  };

  const likeCount = typeof post.likeCount === 'number' ? post.likeCount : (post.likes?.length || 0);
  const likedByUser = typeof post.likedByUser === 'boolean'
    ? post.likedByUser
    : post.likes?.some((id) => id.toString() === currentUserId);

  const isOwner = post.author?._id?.toString() === currentUserId;
  const scamType = (post.scamType || 'phishing').toLowerCase();
  const isCritical = ['breach', 'critical', 'ransom', 'malware'].some((token) => scamType.includes(token));
  const isSecondary = ['otp', 'fraud', 'investment'].some((token) => scamType.includes(token));
  const tone = isCritical ? 'error' : isSecondary ? 'secondary' : scamType.includes('other') ? 'tertiary' : 'primary';
  const toneMap = {
    error: {
      border: 'border-error',
      badge: 'bg-error-container/20 text-error border-error/30',
      accent: 'shadow-[0_0_20px_rgba(255,180,171,0.2)]'
    },
    secondary: {
      border: 'border-secondary',
      badge: 'bg-secondary-container/20 text-secondary-fixed-dim border-secondary/30',
      accent: 'shadow-[0_0_20px_rgba(209,188,255,0.2)]'
    },
    tertiary: {
      border: 'border-tertiary-fixed-dim',
      badge: 'bg-tertiary-container/10 text-tertiary-fixed-dim border-tertiary/30',
      accent: 'shadow-[0_0_20px_rgba(0,226,144,0.2)]'
    },
    primary: {
      border: 'border-primary',
      badge: 'bg-primary-container/10 text-primary-fixed-dim border-primary/30',
      accent: 'shadow-[0_0_20px_rgba(0,240,255,0.2)]'
    }
  };
  const toneClasses = toneMap[tone];

  return (
    <div
      id={`post-${post._id}`}
      className={`relative rounded-2xl border ${highlighted ? 'border-primary-container ring-2 ring-primary-container/40' : toneClasses.border} bg-surface-container-high/60 p-6 ${toneClasses.accent} overflow-hidden transition-shadow`}
    >
      <div className="absolute -left-1 top-6 h-24 w-1 rounded-full bg-primary-container"></div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-container-highest flex items-center justify-center text-primary-container">
            {post.author?.profile_picture ? (
              <img src={getAvatarUrl(post.author.profile_picture)} alt={post.author.name} className="w-full h-full object-cover" />
            ) : (
              post.author?.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h4 className="font-headline text-on-surface font-semibold">{post.author?.name || 'Community Member'}</h4>
            <span className="font-label text-[10px] text-outline uppercase tracking-wider">
              ID: {post.author?._id?.toString().slice(-6) || '000000'} // {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          {post.author?.badge_level && (
            <span className="ml-2 text-[10px] font-label px-2 py-0.5 rounded border border-primary-container/40 text-primary-container uppercase tracking-widest">
              {post.author.badge_level}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-label font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${toneClasses.badge}`}>
            {post.scamType?.replace('_', ' ') || 'phishing'}
          </span>
          {isOwner ? (
            <button
              type="button"
              className="text-red-400 text-xs"
              onClick={() => onDelete(post._id)}
              aria-label="Delete post"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          ) : (
            <button type="button" className="text-outline-variant" aria-label="More">
              <span className="material-symbols-outlined text-base">more_vert</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
        {post.content}
      </div>

      {/* Utility to resolve image URL */}
      {post.imageUrl ? (
        <div className="rounded-lg overflow-hidden h-40 mb-6 border border-outline-variant/20 relative">
          <img src={getAvatarUrl(post.imageUrl)} alt="Post attachment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
      ) : (
        <div className="rounded-lg h-32 mb-6 border border-outline-variant/20 relative overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 via-secondary-container/10 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-cyan-500/20">account_circle</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center gap-6 text-xs uppercase font-label tracking-widest">
          <button type="button" className="flex items-center gap-2 text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined text-base">shield</span>
            Encrypt
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary-container"
            onClick={() => {
              const next = !showComments;
              setShowComments(next);
              if (next && comments.length === 0) {
                handleLoadComments();
              }
            }}
          >
            <span className="material-symbols-outlined text-base">comment</span>
            Comment
          </button>
          <LikeButton liked={likedByUser} count={likeCount} onClick={() => onToggleLike(post._id)} />
        </div>
        <div className="text-outline text-[10px] font-label uppercase tracking-widest">
          Metric {likeCount}
        </div>
      </div>

      {showComments && (
        <CommentBox
          comments={comments}
          onSubmit={handleAddComment}
          loading={commentLoading}
          onLoad={handleLoadComments}
        />
      )}
    </div>
  );
};

export default PostCard;
