import PostCard from './PostCard';

const FeedList = ({ posts, onToggleLike, onDelete, loadComments, addComment, currentUserId, highlightedPostId }) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onToggleLike={onToggleLike}
          onDelete={onDelete}
          loadComments={loadComments}
          addComment={addComment}
          currentUserId={currentUserId}
          highlighted={post._id === highlightedPostId}
        />
      ))}
    </div>
  );
};

export default FeedList;

