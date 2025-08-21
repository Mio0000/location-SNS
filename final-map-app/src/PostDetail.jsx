import React from 'react';
import './PostDetail.css';

function PostDetail({ post, onClose, onLike }) {
  // post がないときは何も描画しない
  if (!post) return null;

  const handleLikeClick = () => {
    console.log("🖱 いいねクリック:", post.id);
    if (typeof onLike === "function") {
      onLike(post.id);
    } else {
      console.warn("⚠️ onLike が渡されていません");
    }
  };

  const handleCloseClick = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleCloseClick}>×</button>

        {post.image && (
          <img
            src={`http://localhost:3001/uploads/${post.image}`}
            alt={post.text || "投稿画像"}
            className="modal-image"
          />
        )}

        <p className="modal-text"><strong>{post.address}</strong></p>
        <p className="modal-text">{post.text}</p>

        <div className="modal-text">
          <button className="like-button" onClick={handleLikeClick}>
            ❤️ ({post.likes || 0})
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
