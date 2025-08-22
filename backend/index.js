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

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });

let posts = [];

app.post('/posts', upload.single('image'), (req, res) => {
  const { text, address } = req.body;
  const image = req.file ? req.file.filename : null;
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    text,
    address,
    image,
    likes: 0,
    createdAt: new Date(),
  };
  posts.push(newPost);
  res.json({ message: '投稿を保存しました！', post: newPost });
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts/:id/like', (req, res) => {
  const idToLike = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === idToLike);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    res.json(post);
  } else {
    res.status(404).json({ message: '投稿が見つかりません。' });
  }
});

app.post('/posts/:id/unlike', (req, res) => {
  const idToUnlike = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === idToUnlike);
  if (post && post.likes > 0) {
    post.likes = post.likes - 1;
    res.json(post);
  } else if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: '投稿が見つかりません。' });
  }
});

app.delete('/posts/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id, 10);
  posts = posts.filter(post => post.id !== idToDelete);
  res.json({ message: `投稿ID: ${idToDelete} を削除しました。` });
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動中`);
});