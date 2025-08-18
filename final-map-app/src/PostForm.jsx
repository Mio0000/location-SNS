// /src/PostForm.jsx

import React, { useState } from 'react';

function PostForm({ onPostSuccess }) {
  // ★★★ textのuseStateを復活させる ★★★
  const [text, setText] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    // ★★★ textをFormDataに追加する処理を復活 ★★★
    formData.append('text', text);
    formData.append('address', address);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
      onPostSuccess();

      // ★★★ textのリセットを復活 ★★★
      setText('');
      setAddress('');
      setImage(null);
      event.target.reset();

    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>投稿フォーム</h3>
      {/* ★★★ テキスト入力欄を復活 ★★★ */}
      <div style={{ marginBottom: '10px' }}>
        <label>投稿テキスト： </label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>住所： </label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>写真： </label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
      </div>
      <button type="submit">送信</button>
    </form>
  );
}

export default PostForm;