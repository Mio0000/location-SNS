const express = require('express');
const router = express.Router();

const posts = [];

router.get('/', (req, res) => {
  res.send(`
    <h1>投稿フォーム</h1>
    <form method="POST" action="/posts">
      <p>
        投稿テキスト:<br>
        <input type="text" name="text" required>
      </p>
      <p>
        緯度:<br>
        <input type="number" step="any" name="latitude">
      </p>
      <p>
        経度:<br>
        <input type="number" step="any" name="longitude">
      </p>
      <button type="submit">送信</button>
    </form>

    <h2>投稿一覧</h2>
    <ul id="posts-list"></ul>

    <script>
      async function loadPosts() {
        const res = await fetch('/posts');
        const posts = await res.json();
        const ul = document.getElementById('posts-list');
        ul.innerHTML = '';
        posts.forEach(post => {
          const li = document.createElement('li');
          li.textContent = \`#\${post.id} \${post.text} (緯度:\${post.latitude || '-'}, 経度:\${post.longitude || '-'})\`;
          ul.appendChild(li);
        });
      }
      loadPosts();
    </script>
  `);
});

router.post('/posts', (req, res) => {
  const { text, latitude, longitude } = req.body;

  const newPost = {
    id: posts.length + 1,
    text,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    createdAt: new Date()
  };

  posts.push(newPost);
  res.redirect('/');
});

router.get('/posts', (req, res) => {
  res.json(posts);
});

module.exports = router;
