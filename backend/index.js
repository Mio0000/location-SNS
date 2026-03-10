const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

const postsFilePath = path.join(__dirname, 'posts.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const loadPosts = () => {
  if (fs.existsSync(postsFilePath)) {
    try { return JSON.parse(fs.readFileSync(postsFilePath, 'utf8')); }
    catch { return []; }
  }
  return [];
};

const savePosts = (posts) => {
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
};

// 投稿一覧取得
app.get('/posts', (req, res) => {
  res.json(loadPosts());
});

// 投稿作成
app.post('/posts', upload.single('image'), (req, res) => {
  const { text, address } = req.body;
  const image = req.file ? req.file.filename : null;
  const posts = loadPosts();
  const newPost = {
    id: Date.now().toString(),
    text,
    address,
    image,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  savePosts(posts);
  res.status(201).json({ message: '投稿を保存しました！', post: newPost });
});

// いいね
app.post('/posts/:id/like', (req, res) => {
  const posts = loadPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: '投稿が見つかりません。' });
  post.likes = (post.likes || 0) + 1;
  savePosts(posts);
  res.json(post);
});

// いいね解除
app.post('/posts/:id/unlike', (req, res) => {
  const posts = loadPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: '投稿が見つかりません。' });
  post.likes = Math.max(0, (post.likes || 0) - 1);
  savePosts(posts);
  res.json(post);
});

// 投稿削除
app.delete('/posts/:id', (req, res) => {
  let posts = loadPosts();
  const before = posts.length;
  posts = posts.filter(p => p.id !== req.params.id);
  if (posts.length < before) {
    savePosts(posts);
    return res.json({ message: '投稿を削除しました。' });
  }
  res.status(404).json({ message: '投稿が見つかりません。' });
});

// コメント投稿
app.post('/posts/:id/comments', (req, res) => {
  const posts = loadPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: '投稿が見つかりません。' });
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'コメントが空です。' });
  if (!post.comments) post.comments = [];
  const newComment = {
    id: Date.now().toString(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  post.comments.push(newComment);
  savePosts(posts);
  res.json({ message: 'コメントを追加しました', comment: newComment, post });
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動中`);
});
