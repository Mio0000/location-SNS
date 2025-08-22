import React, { useState, useEffect } from 'react';
import JapanMap from './JapanMap.jsx';
import PostForm from './PostForm.jsx';
import PostDetail from './PostDetail.jsx';
import './App.css';
import './PostDetail.css';

const PREFECTURE_NAME_TO_ID = { '北海道': 'JP-01', '青森県': 'JP-02', '岩手県': 'JP-03', '宮城県': 'JP-04', '秋田県': 'JP-05', '山形県': 'JP-06', '福島県': 'JP-07', '茨城県': 'JP-08', '栃木県': 'JP-09', '群馬県': 'JP-10', '埼玉県': 'JP-11', '千葉県': 'JP-12', '東京都': 'JP-13', '神奈川県': 'JP-14', '新潟県': 'JP-15', '富山県': 'JP-16', '石川県': 'JP-17', '福井県': 'JP-18', '山梨県': 'JP-19', '長野県': 'JP-20', '岐阜県': 'JP-21', '静岡県': 'JP-22', '愛知県': 'JP-23', '三重県': 'JP-24', '滋賀県': 'JP-25', '京都府': 'JP-26', '大阪府': 'JP-27', '兵庫県': 'JP-28', '奈良県': 'JP-29', '和歌山県': 'JP-30', '鳥取県': 'JP-31', '島根県': 'JP-32', '岡山県': 'JP-33', '広島県': 'JP-34', '山口県': 'JP-35', '徳島県': 'JP-36', '香川県': 'JP-37', '愛媛県': 'JP-38', '高知県': 'JP-39', '福岡県': 'JP-40', '佐賀県': 'JP-41', '長崎県': 'JP-42', '熊本県': 'JP-43', '大分県': 'JP-44', '宮崎県': 'JP-45', '鹿児島県': 'JP-46', '沖縄県': 'JP-47' };
const ID_TO_PREFECTURE_NAME = Object.fromEntries(Object.entries(PREFECTURE_NAME_TO_ID).map(([name, id]) => [id, name]));
const getPrefectureFromAddress = (address) => { if (!address) return null; for (const pref in PREFECTURE_NAME_TO_ID) { if (address.includes(pref)) { return pref; } } return null; };

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => new Set(JSON.parse(localStorage.getItem('likedPosts')) || []));

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

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
        await fetch(`http://localhost:3001/posts/${postId}`, { method: 'DELETE' });
        fetchPosts();
      } catch (error) {
        alert('投稿の削除に失敗しました。');
      }
    }
  };

  const handleLike = async (postId) => {
    const isLiked = likedPosts.has(postId);
    const endpoint = isLiked ? 'unlike' : 'like';

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/${endpoint}`, { method: 'POST' });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(currentPosts => currentPosts.map(p => p.id === postId ? updatedPost : p));
        const newLikedPosts = new Set(likedPosts);
        if (isLiked) {
          newLikedPosts.delete(postId);
        } else {
          newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(updatedPost);
        }
      } else { throw new Error('いいねに失敗しました。'); }
    } catch (error) {
      alert('いいねに失敗しました。');
    }
  };

  const handlePinClick = (post) => setSelectedPost(post);
  const handleCloseDetail = () => setSelectedPost(null);

  const handleMapClick = (event) => {
    const prefectureId = event.target.id;
    if (prefectureId && prefectureId.startsWith('JP-')) {
      const prefectureName = ID_TO_PREFECTURE_NAME[prefectureId];
      const latestPostForPrefecture = [...posts].find(p => getPrefectureFromAddress(p.address) === prefectureName);
      if (latestPostForPrefecture) {
        setSelectedPost(latestPostForPrefecture);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header"><h1>日本の思い出をシェアしよう！</h1></header>
      <main className="App-main">
        <div className="map-container" onClick={handleMapClick}><JapanMap posts={posts} onPinClick={handlePinClick} /></div>
        <div className="sidebar">
          <PostForm onPostSuccess={fetchPosts} />
          <div className="post-list">
            <h2>投稿一覧</h2>
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <p><strong>{post.address}</strong></p>
                <p>{post.text}</p>
                {post.image && <img src={`http://localhost:3001/uploads/${post.image}`} alt={post.text} className="post-image" onClick={() => handlePinClick(post)} />}
                <div className="post-actions">
                  <button className={`like-button ${likedPosts.has(post.id) ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>❤️ ({post.likes || 0})</button>
                  <button onClick={() => handleDelete(post.id)} className="delete-button">削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PostDetail post={selectedPost} onClose={handleCloseDetail} onLike={handleLike} isLiked={selectedPost && likedPosts.has(selectedPost.id)} />
    </div>
  );
}

export default App;