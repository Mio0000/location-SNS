// /src/App.jsx

import React, { useState, useEffect } from 'react';
import JapanMap from './JapanMap.jsx';
import PostForm from './PostForm.jsx';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch('http://localhost:3001/posts')
      .then(res => res.json())
      .then(data => setPosts(data.reverse()))
      .catch(error => console.error('データ取得エラー:', error));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm('本当にこの投稿を削除しますか？')) {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        alert(result.message);
        fetchPosts();
      } catch (error) {
        console.error('削除エラー:', error);
        alert('投稿の削除に失敗しました。');
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>日本の思い出をシェアしよう！</h1>
      </header>
      
      <main className="App-main">
        <div className="map-container">
          <JapanMap posts={posts} />
        </div>

        <div className="sidebar">
          <PostForm onPostSuccess={fetchPosts} />

          <div className="post-list">
            <h2>投稿一覧</h2>
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <p><strong>{post.address}</strong></p>
                {/* ★★★ post.text の表示を復活 ★★★ */}
                <p>{post.text}</p>
                {post.image && (
                  <img
                    src={`http://localhost:3001/uploads/${post.image}`}
                    alt={post.text} // altはtextの方が親切！
                    className="post-image"
                  />
                )}
                <button onClick={() => handleDelete(post.id)} className="delete-button">
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;