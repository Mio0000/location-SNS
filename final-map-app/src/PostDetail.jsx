// PostDetail.jsx
import React, { useState, useEffect } from 'react';
import './PostDetail.css';

function PostDetail({ post, onClose, onLike, isLiked }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // コメント取得
  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
    }
  }, [post]);

  // コメント送信
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });

      const result = await response.json();

      if (response.ok) {
        setComments((prev) => [...prev, result.comment]);
        setNewComment('');
      } else {
        alert(result.message || 'コメント投稿に失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert('コメント投稿に失敗しました');
    }
  };

  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        {post.image && (
          <img
            src={`http://localhost:3001/uploads/${post.image}`}
            alt={post.text}
            className="modal-image"
          />
        )}

        <div className="modal-text">
          <h3>{post.address}</h3>
          <p>{post.text}</p>

          <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={() => onLike(post.id)}>
            ❤️ ({post.likes || 0})
          </button>

          <div className="comments-section">
            <h4>コメント</h4>
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <p>{c.text}</p>
                    <small>{new Date(c.createdAt).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic' }}>コメントはまだありません</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="コメントを入力..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit">送信</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
