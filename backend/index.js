const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// 投稿を保存するための配列（メモリ上）
const posts = [];

// 投稿を受け取るAPI
app.post('/posts', (req, res) => {
  const { text, latitude, longitude } = req.body;

  const newPost = {
    id: posts.length + 1,
    text,
    latitude,
    longitude,
    createdAt: new Date()
  };

  posts.push(newPost);

  res.json({ message: '投稿を保存しました！', post: newPost });
});

// 投稿一覧を返すAPI
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動中`);
});

