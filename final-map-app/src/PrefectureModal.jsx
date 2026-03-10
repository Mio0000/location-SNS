import React, { useState } from 'react';
import './PrefectureModal.css';

function PostCard({ post, onLike, isLiked, onDelete, onCommentSubmit }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await onCommentSubmit(post.id, newComment);
    setNewComment('');
  };

  return (
    <div className="pref-post-card">
      {post.image && (
        <img
          src={`http://localhost:3001/uploads/${post.image}`}
          alt={post.text}
          className="pref-post-image"
        />
      )}
      <div className="pref-post-body">
        <p className="pref-post-text">{post.text}</p>
        <small className="pref-post-date">
          {post.createdAt ? new Date(post.createdAt).toLocaleString('ja-JP') : ''}
        </small>
        <div className="pref-post-actions">
          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={() => onLike(post.id)}
          >
            ❤️ ({post.likes || 0})
          </button>
          <button
            className="comment-toggle-btn"
            onClick={() => setShowComments(v => !v)}
          >
            💬 {showComments ? '閉じる' : `コメント (${(post.comments || []).length})`}
          </button>
          <button className="delete-button" onClick={() => onDelete(post.id)}>
            削除
          </button>
        </div>

        {showComments && (
          <div className="pref-comments">
            <div className="pref-comments-list">
              {(post.comments || []).length === 0 ? (
                <p className="pref-no-comments">コメントはまだありません</p>
              ) : (
                (post.comments || []).map(c => (
                  <div key={c.id} className="pref-comment-item">
                    <p>{c.text}</p>
                    <small>{new Date(c.createdAt).toLocaleString('ja-JP')}</small>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSubmit} className="pref-comment-form">
              <input
                type="text"
                placeholder="コメントを入力..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit">送信</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function PrefectureModal({ prefectureName, posts, onClose, onLike, likedPosts, onDelete, onCommentSubmit }) {
  if (!prefectureName) return null;

  return (
    <div className="pref-modal-overlay" onClick={onClose}>
      <div className="pref-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="pref-modal-title">📍 {prefectureName}</h2>

        {posts.length === 0 ? (
          <p className="pref-no-posts">まだ投稿がありません</p>
        ) : (
          <div className="pref-post-list">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLike}
                isLiked={likedPosts.has(post.id)}
                onDelete={onDelete}
                onCommentSubmit={onCommentSubmit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrefectureModal;
