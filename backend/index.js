const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// アップロード先ディレクトリ
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// 画像保存設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });

// 投稿データ
let posts = [];

// 投稿作成
app.post('/posts', upload.single('image'), (req, res) => {
  const { text, address } = req.body;
  const image = req.file ? req.file.filename : null;
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    text,
    address,
    image,
    likes: 0,
    comments: [], // コメント配列を追加
    createdAt: new Date(),
  };
  posts.push(newPost);
  res.json({ message: '投稿を保存しました！', post: newPost });
});

// 投稿一覧取得
app.get('/posts', (req, res) => {
  res.json(posts);
});

// いいね
app.post('/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    res.json(post);
  } else {
    res.status(404).json({ message: '投稿が見つかりません。' });
  }
});

// いいね解除
app.post('/posts/:id/unlike', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  if (post && post.likes > 0) {
    post.likes -= 1;
    res.json(post);
  } else if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: '投稿が見つかりません。' });
  }
});

// 投稿削除
app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  posts = posts.filter(p => p.id !== postId);
  res.json({ message: `投稿ID: ${postId} を削除しました。` });
});

// コメント投稿
app.post('/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: '投稿が見つかりません。' });
  }

  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'コメントが空です。' });
  }

  const newComment = {
    id: post.comments.length > 0 ? Math.max(...post.comments.map(c => c.id)) + 1 : 1,
    text,
    createdAt: new Date(),
  };

  post.comments.push(newComment);
  res.json({ message: 'コメントを追加しました', comment: newComment });
});

// サーバー起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動中`);
});
