// PostDetail.jsx
import React, { useState, useEffect } from 'react';
import './PostDetail.css';

function PostDetail({ post, onClose, onLike, isLiked, onCommentSubmit, onEdit }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
      setEditText(post.text || '');
      setEditAddress(post.address || '');
      setIsEditing(false);
    }
  }, [post]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await onCommentSubmit(post.id, newComment);
    setNewComment('');
  };

  const handleSave = async () => {
    await onEdit(post.id, { text: editText, address: editAddress });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(post.text || '');
    setEditAddress(post.address || '');
    setIsEditing(false);
  };

  const shareUrl = post
    ? `${window.location.origin}${window.location.pathname}?post=${post.id}`
    : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // フォールバック
    }
  };

  const handleLineShare = () => {
    const text = `${post.address}の思い出 👉 ${shareUrl}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
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
          <p className="modal-username">👤 {post.username || '匿名'}</p>

          {isEditing ? (
            <div className="modal-edit-form">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="テキスト"
              />
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="住所"
              />
              <div className="modal-edit-actions">
                <button className="save-button" onClick={handleSave}>保存</button>
                <button className="cancel-button" onClick={handleCancelEdit}>キャンセル</button>
              </div>
            </div>
          ) : (
            <>
              <p>{post.text}</p>
              <button className="edit-button" onClick={() => setIsEditing(true)}>✏️ 編集</button>
            </>
          )}

          <div className="post-detail-actions">
            <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={() => onLike(post.id)}>
              ❤️ ({post.likes || 0})
            </button>
            <button className="share-button" onClick={() => setShowShareDialog(v => !v)}>
              🔗 友達にシェア
            </button>
          </div>

          {showShareDialog && (
            <div className="share-dialog">
              <p className="share-dialog-label">このURLを友達に送ろう！</p>
              <div className="share-url-row">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="share-url-input"
                  onClick={e => e.target.select()}
                />
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopyUrl}
                >
                  {copied ? '✅' : 'コピー'}
                </button>
              </div>
              <button className="line-share-btn" onClick={handleLineShare}>
                LINE で送る
              </button>
              <p className="share-note">
                ※ローカル環境では自分のPCのみ有効です。<br />
                友達と共有するには <strong>ngrok</strong> などで公開してください。
              </p>
            </div>
          )}

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
