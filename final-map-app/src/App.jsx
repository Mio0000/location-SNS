import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  // シェアリンク: URLパラメータ ?post=ID で投稿を自動オープン
  const initialPostIdRef = useRef(
    new URLSearchParams(window.location.search).get('post')
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

  // URLパラメータの投稿を自動オープン
  useEffect(() => {
    if (posts.length > 0 && initialPostIdRef.current) {
      const target = posts.find(p => p.id === initialPostIdRef.current);
      if (target) {
        setSelectedPost(target);
        initialPostIdRef.current = null;
      }
    }
  }, [posts]);

  // 制覇済み都道府県数
  const visitedPrefCount = useMemo(() => {
    const visited = new Set();
    posts.forEach(post => {
      const pref = getPrefectureFromAddress(post.address);
      if (pref) visited.add(pref);
    });
    return visited.size;
  }, [posts]);

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePrefectureClick = (prefName) => setSelectedPrefecture(prefName);
  const handleClosePrefecture = () => setSelectedPrefecture(null);
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

  const handleEdit = async (postId, updates) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const result = await response.json();
      if (response.ok) {
        setPosts(current => current.map(p => p.id === postId ? result : p));
        if (selectedPost && selectedPost.id === postId) setSelectedPost(result);
      } else {
        alert(result.message || '編集に失敗しました');
      }
    } catch {
      alert('編集に失敗しました');
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
        setPosts(current => current.map(p => p.id === postId ? result.post : p));
        if (selectedPost && selectedPost.id === postId) setSelectedPost(result.post);
      } else {
        alert(result.message || 'コメント投稿に失敗しました');
      }
    } catch {
      alert('コメント投稿に失敗しました');
    }
  };

  const prefecturePosts = selectedPrefecture
    ? sortedPosts.filter(p => getPrefectureFromAddress(p.address) === selectedPrefecture)
    : [];

  const progressPct = Math.round((visitedPrefCount / 47) * 100);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">🗾 日本の思い出マップ</h1>
        <div className="App-progress">
          <span className="progress-label">
            {visitedPrefCount} <small>/ 47 都道府県</small>
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="progress-pct">{progressPct}%</span>
        </div>
      </header>

      <main className="App-main">
        <div className="map-panel">
          <JapanMap posts={posts} onPrefectureClick={handlePrefectureClick} />
        </div>

        <aside className="form-panel">
          <div className="form-panel-inner">
            <p className="form-panel-hint">
              都道府県をクリックすると投稿が見られるよ！
            </p>
            <PostForm onPostSuccess={fetchPosts} />
          </div>
        </aside>
      </main>

      <PrefectureModal
        prefectureName={selectedPrefecture}
        posts={prefecturePosts}
        onClose={handleClosePrefecture}
        onLike={handleLike}
        likedPosts={likedPosts}
        onDelete={handleDelete}
        onCommentSubmit={handleCommentSubmit}
        onEdit={handleEdit}
        onPostClick={setSelectedPost}
      />

      <PostDetail
        post={selectedPost}
        onClose={handleCloseDetail}
        onLike={handleLike}
        isLiked={selectedPost && likedPosts.has(selectedPost.id)}
        onCommentSubmit={handleCommentSubmit}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;
