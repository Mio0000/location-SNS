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

// uploadsフォルダのパスを変数に入れておく
const uploadsDir = path.join(__dirname, 'uploads');

// サーバーが起動する時に、uploadsフォルダがなかったら自動で作るおまじない
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// uploadsフォルダを公開して、写真にアクセスできるようにする設定
app.use('/uploads', express.static(uploadsDir));

// multer（マルター）の設定：どこに何を保存するか
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// 投稿を保存するための配列。サーバーを再起動すると消える。
let posts = [];

// 投稿を受け取るAPI
app.post('/posts', upload.single('image'), (req, res) => {
  const { text, address } = req.body;
  const image = req.file ? req.file.filename : null;

  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    text,
    address,
    image,
    createdAt: new Date(),
  };

  posts.push(newPost);
  console.log('新しい投稿を受け取りました:', newPost);
  res.json({ message: '投稿を保存しました！', post: newPost });
});

// 投稿一覧を返すAPI
app.get('/posts', (req, res) => {
  res.json(posts);
});

// 投稿を削除するAPI
app.delete('/posts/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id, 10);
  const newPosts = posts.filter(post => post.id !== idToDelete);

  if (posts.length === newPosts.length) {
    return res.status(404).json({ message: '指定された投稿が見つかりませんでした。' });
  }

  posts = newPosts;
  console.log(`投稿ID: ${idToDelete} を削除しました。`);
  res.json({ message: `投稿ID: ${idToDelete} を削除しました。` });
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動中`);
});