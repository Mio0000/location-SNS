import React, { useState } from 'react';

function PostForm({ onPostSuccess }) {
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

     if (response.ok) {
        alert(result.message);
        
        // 投稿成功後、親コンポーネントに成功を通知
        onPostSuccess();
        
        // フォームの状態をクリア
        setText('');
        setAddress('');
        setImage(null);
        event.target.reset(); // ファイル選択フィールドをリセット
      } else {
        const result = await response.json();
        alert(result.message || '投稿に失敗しました。');
      }
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h3>新しい思い出を投稿</h3>
      <div className="post-form-group">
        <label>テキスト</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="どんな思い出？" required />
      </div>
      <div className="post-form-group">
        <label>住所（都道府県名を含めて入力）</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="例：東京都新宿区" required />
      </div>
      <div className="post-form-group">
        <label>写真</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
      </div>
      <button type="submit" className="post-form-submit">投稿する</button>
    </form>
  );
}

export default PostForm;