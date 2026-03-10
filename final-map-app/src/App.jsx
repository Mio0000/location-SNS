import React, { useState, useEffect } from 'react';
import JapanMap from './JapanMap.jsx';
import PostForm from './PostForm.jsx';
import PostDetail from './PostDetail.jsx';
import PrefectureModal from './PrefectureModal.jsx';
import './App.css';
import './PostDetail.css';

const PREFECTURE_NAME_TO_ID = {
  '北海道': 'JP-01', '青森県': 'JP-02', '岩手県': 'JP-03', '宮城県': 'JP-04',
  '秋田県': 'JP-05', '山形県': 'JP-06', '福島県': 'JP-07', '茨城県': 'JP-08',
  '栃木県': 'JP-09', '群馬県': 'JP-10', '埼玉県': 'JP-11', '千葉県': 'JP-12',
  '東京都': 'JP-13', '神奈川県': 'JP-14', '新潟県': 'JP-15', '富山県': 'JP-16',
  '石川県': 'JP-17', '福井県': 'JP-18', '山梨県': 'JP-19', '長野県': 'JP-20',
  '岐阜県': 'JP-21', '静岡県': 'JP-22', '愛知県': 'JP-23', '三重県': 'JP-24',
  '滋賀県': 'JP-25', '京都府': 'JP-26', '大阪府': 'JP-27', '兵庫県': 'JP-28',
  '奈良県': 'JP-29', '和歌山県': 'JP-30', '鳥取県': 'JP-31', '島根県': 'JP-32',
  '岡山県': 'JP-33', '広島県': 'JP-34', '山口県': 'JP-35', '徳島県': 'JP-36',
  '香川県': 'JP-37', '愛媛県': 'JP-38', '高知県': 'JP-39', '福岡県': 'JP-40',
  '佐賀県': 'JP-41', '長崎県': 'JP-42', '熊本県': 'JP-43', '大分県': 'JP-44',
  '宮崎県': 'JP-45', '鹿児島県': 'JP-46', '沖縄県': 'JP-47',
};

const getPrefectureFromAddress = (address) => {
  if (!address) return null;
  for (const pref in PREFECTURE_NAME_TO_ID) {
    if (address.includes(pref)) return pref;
  }
  return null;
};

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const [likedPosts, setLikedPosts] = useState(
    () => new Set(JSON.parse(localStorage.getItem('likedPosts')) || [])
  );

  useEffect(() => {
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

  const fetchPosts = () => {
    fetch('http://localhost:3001/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(error => console.error('データ取得エラー:', error));
  };

  useEffect(() => { fetchPosts(); }, []);

  // 都道府県クリック → PrefectureModal
  const handlePrefectureClick = (prefName) => {
    setSelectedPrefecture(prefName);
  };

  const handleClosePrefecture = () => setSelectedPrefecture(null);

  // サイドバー画像クリック → PostDetail
  const handlePinClick = (post) => setSelectedPost(post);
  const handleCloseDetail = () => setSelectedPost(null);

  const handleDelete = async (postId) => {
    if (window.confirm('本当にこの投稿を削除しますか？')) {
      try {
        await fetch(`http://localhost:3001/posts/${postId}`, { method: 'DELETE' });
        fetchPosts();
        if (selectedPost && selectedPost.id === postId) setSelectedPost(null);
      } catch {
        alert('投稿の削除に失敗しました。');
      }
    }
  };

  const handleLike = async (postId) => {
    const isLiked = likedPosts.has(postId);
    const endpoint = isLiked ? 'unlike' : 'like';
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/${endpoint}`, { method: 'POST' });
      if (!response.ok) throw new Error();
      const updatedPost = await response.json();
      setPosts(current => current.map(p => p.id === postId ? updatedPost : p));
      const newLiked = new Set(likedPosts);
      if (isLiked) newLiked.delete(postId); else newLiked.add(postId);
      setLikedPosts(newLiked);
      if (selectedPost && selectedPost.id === postId) setSelectedPost(updatedPost);
    } catch {
      alert('いいねに失敗しました。');
    }
  };

  const handleCommentSubmit = async (postId, commentText) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });
      const result = await response.json();
      if (response.ok) {
        // バックエンドから返ってきた更新済み投稿でstateを更新
        setPosts(current => current.map(p => p.id === postId ? result.post : p));
        if (selectedPost && selectedPost.id === postId) setSelectedPost(result.post);
      } else {
        alert(result.message || 'コメント投稿に失敗しました');
      }
    } catch {
      alert('コメント投稿に失敗しました');
    }
  };

  // 選択中の都道府県に紐づく投稿
  const prefecturePosts = selectedPrefecture
    ? posts.filter(p => getPrefectureFromAddress(p.address) === selectedPrefecture)
    : [];

  return (
    <div className="App">
      <header className="App-header"><h1>日本の思い出をシェアしよう！</h1></header>
      <main className="App-main">
        <div className="map-container">
          <JapanMap posts={posts} onPrefectureClick={handlePrefectureClick} />
        </div>
        <div className="sidebar">
          <PostForm onPostSuccess={fetchPosts} />
          <div className="post-list">
            <h2>投稿一覧</h2>
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <p><strong>{post.address}</strong></p>
                <p>{post.text}</p>
                {post.image && (
                  <img
                    src={`http://localhost:3001/uploads/${post.image}`}
                    alt={post.text}
                    className="post-image"
                    onClick={() => handlePinClick(post)}
                  />
                )}
                <small className="post-date">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString('ja-JP') : ''}
                </small>
                <div className="post-actions">
                  <button
                    className={`like-button ${likedPosts.has(post.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    ❤️ ({post.likes || 0})
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="delete-button">削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 都道府県モーダル */}
      <PrefectureModal
        prefectureName={selectedPrefecture}
        posts={prefecturePosts}
        onClose={handleClosePrefecture}
        onLike={handleLike}
        likedPosts={likedPosts}
        onDelete={handleDelete}
        onCommentSubmit={handleCommentSubmit}
      />

      {/* サイドバー画像クリック時の詳細モーダル（既存） */}
      <PostDetail
        post={selectedPost}
        onClose={handleCloseDetail}
        onLike={handleLike}
        isLiked={selectedPost && likedPosts.has(selectedPost.id)}
        onCommentSubmit={handleCommentSubmit}
      />
    </div>
  );
}

export default App;
