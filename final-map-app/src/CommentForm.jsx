import React, { useState } from 'react';

function CommentForm({ postId, onCommentSuccess }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // 空のコメントは投稿しない

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setText(''); // フォームを空にする
        onCommentSuccess(); // 親に「成功したよ！」と伝える
      } else {
        throw new Error('コメント投稿に失敗');
      }
    } catch (error) {
      console.error('コメント投稿エラー:', error);
      alert('コメントの投稿に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        placeholder="コメントを追加..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">投稿</button>
    </form>
  );
}

export default CommentForm;