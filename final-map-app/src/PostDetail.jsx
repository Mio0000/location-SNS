import React from 'react';
import './PostDetail.css';

function PostDetail({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <img src={`http://localhost:3001/uploads/${post.image}`} alt={post.text} className="modal-image" />
        <div className="modal-text">
          <h3>{post.address}</h3>
          <p>{post.text}</p>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;