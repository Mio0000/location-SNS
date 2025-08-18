const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ★★★ ファイル操作の神様(fs)を呼び出す ★★★
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 👇ここから改造！👇 ---

// uploadsフォルダのパスを変数に入れておく
const uploadsDir = path.join(__dirname, 'uploads');

// サーバーが起動する時に、uploadsフォルダがなかったら自動で作るおまじない
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// uploadsフォルダを公開する設定
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // 保存先をさっきの変数にする
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// --- 👆ここまで改造！👆 ---

const upload = multer({ storage });

let posts = [];

// これより下のAPIの部分は変更なし！
// ... (app.post, app.get, app.delete, app.listen) ...
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
  console.log('新しい投稿(写真付き):', newPost);
  res.json({ message: '写真付き投稿を保存しました！', post: newPost });
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

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