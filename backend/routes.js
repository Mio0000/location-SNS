const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// --- 1. 変数と関数の定義 ---
const postsFilePath = path.join(__dirname, 'posts.json');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const loadPosts = () => {
    if (fs.existsSync(postsFilePath)) {
        const data = fs.readFileSync(postsFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

const savePosts = (posts) => {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
};

// --- 2. ミドルウェアの設定（重要）---
// すべてのエンドポイントの前に配置する
router.use(cors());
router.use('/uploads', express.static(uploadsDir));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// --- 3. APIエンドポイントの定義 ---
router.get('/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

router.post('/posts', upload.single('image'), (req, res) => {
    const { text, address } = req.body;
    const image = req.file ? req.file.filename : null;

    const posts = loadPosts();
    const newPost = {
        id: Date.now().toString(),
        text,
        address,
        image,
        likes: 0,
        createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    savePosts(posts);

    res.status(201).json(newPost);
});

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