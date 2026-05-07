import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePostForm from '../components/CreatePostForm';
import FeedList from '../components/FeedList';
import {
  fetchFeed,
  fetchPost,
  createPost,
  toggleLike,
  fetchComments,
  addComment,
  deletePost
} from '../services/communityService';

const Community = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetPostId = searchParams.get('post');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const dedupePosts = (items) => {
    const byId = new Map();
    items.forEach((item) => {
      if (item?._id) byId.set(item._id, item);
    });
    return Array.from(byId.values());
  };

  const loadFeed = async ({ nextPage = 1, append = false } = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFeed({ page: nextPage, limit: 6 });
      let nextPosts = data.posts || [];

      if (targetPostId && !nextPosts.some((post) => post._id === targetPostId)) {
        try {
          const targeted = await fetchPost(targetPostId);
          if (targeted.post) {
            nextPosts = [targeted.post, ...nextPosts];
          }
        } catch {
          setError('The notification post is no longer available.');
        }
      }

      setPosts((prev) => dedupePosts(append ? [...prev, ...nextPosts] : nextPosts));
      setPage(data.page || nextPage);
      setHasMore((data.page || nextPage) < (data.totalPages || 1));
    } catch (err) {
      setError('Unable to load community feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed({ nextPage: 1, append: false });
  }, [targetPostId]);

  useEffect(() => {
    if (!targetPostId || posts.length === 0) return;
    const timer = setTimeout(() => {
      document.getElementById(`post-${targetPostId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [targetPostId, posts]);

  const handleCreate = async (payload) => {
    setCreating(true);
    try {
      const data = await createPost(payload);
      // Ensure new post has up-to-date author info
      const newPost = {
        ...data.post,
        author: {
          ...(data.post.author || {}),
          name: user?.name,
          profile_picture: user?.profile_picture,
          badge_level: user?.badge_level,
          _id: user?._id || user?.id,
        },
      };
      setPosts((prev) => [newPost, ...prev]);
      setCreating(false);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create post.');
      setCreating(false);
      return false;
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const data = await toggleLike(postId);
      setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, ...data.post } : post)));
      window.dispatchEvent(new Event('notifications:refresh'));
    } catch (err) {
      setError('Unable to update like.');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setError('Unable to delete post.');
    }
  };

  const handleLoadComments = async (postId) => {
    try {
      const data = await fetchComments(postId);
      return data.comments || [];
    } catch (err) {
      return [];
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      const data = await addComment(postId, content);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
      window.dispatchEvent(new Event('notifications:refresh'));
      return data.comment;
    } catch (err) {
      setError('Unable to add comment.');
      return null;
    }
  };

  return (
    <div
      className="pt-24 pb-32 px-4 max-w-4xl mx-auto relative overflow-hidden space-y-8 page-bg"
      style={{ '--page-bg': "url('https://source.unsplash.com/1600x900/?cybersecurity,community')" }}
    >
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-1/2 -left-20 w-80 h-80 bg-secondary-container/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(132,148,149,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(132,148,149,0.3) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

      <header className="flex items-baseline justify-between mb-2 border-l-2 border-primary-container pl-4 relative z-10">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
            Community Social Feed
          </h1>
          <p className="font-label text-xs text-outline tracking-widest uppercase mt-1">
            Share scam stories, learn from peers, and build awareness together.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
          <span className="font-label text-[10px] text-tertiary-fixed-dim tracking-widest">LIVE_SYNC</span>
        </div>
      </header>

      <CreatePostForm onCreate={handleCreate} loading={creating} />
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && posts.length === 0 ? (
        <div className="glass-card border border-outline-variant/20 rounded-xl p-6">Loading feed...</div>
      ) : (
        <FeedList
          posts={posts}
          onToggleLike={handleToggleLike}
          onDelete={handleDelete}
          loadComments={handleLoadComments}
          addComment={handleAddComment}
          currentUserId={user?.id || user?._id}
          highlightedPostId={targetPostId}
        />
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface font-label text-xs uppercase tracking-widest hover:border-primary-container transition-colors"
            onClick={() => loadFeed({ nextPage: page + 1, append: true })}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
