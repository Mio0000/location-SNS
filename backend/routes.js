const express = require('express');
const router = express.Router();
const cors = require('cors'); // CORSミドルウェアを追加
const multer = require('multer'); // ファイルアップロード用ミドルウェアを追加
const fs = require('fs');
const path = require('path');

// posts.jsonファイルのパスを定義
const postsFilePath = path.join(__dirname, 'posts.json');
const uploadsDir = path.join(__dirname, 'uploads');

// アップロードディレクトリが存在しない場合は作成
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// ファイル保存設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ミドルウェア設定
router.use(cors());
router.use('/uploads', express.static(uploadsDir)); // アップロードされた画像を公開

// 投稿データの読み込み
const loadPosts = () => {
    if (fs.existsSync(postsFilePath)) {
        const data = fs.readFileSync(postsFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

// 投稿データの保存
const savePosts = (posts) => {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
};

// すべての投稿を取得
router.get('/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

// 新しい投稿を追加（画像アップロードを含む）
router.post('/posts', upload.single('image'), (req, res) => {
    const { text, address } = req.body;
    const image = req.file ? req.file.filename : null;

    const posts = loadPosts();
    const newPost = {
        id: Date.now().toString(),
        text,
        address,
        image,
        likes: 0, // いいね！の初期値を設定
        createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    savePosts(posts);

    res.status(201).json(newPost);
});

// いいね！を追加・更新するAPIエンドポイント
router.post('/posts/:id/like', (req, res) => {
    const postId = req.params.id;
    const posts = loadPosts();
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ message: '投稿が見つかりません。' });
    }

    posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
    savePosts(posts);

    res.status(200).json(posts[postIndex]);
});

// 投稿を削除
router.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;
    let posts = loadPosts();
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== postId);

    if (posts.length < initialLength) {
        savePosts(posts);
        return res.status(200).json({ message: '投稿を削除しました。' });
    }
    res.status(404).json({ message: '投稿が見つかりません。' });
});

module.exports = router;