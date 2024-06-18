const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer(router);
const io = new Server(server);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username').populate('comments.user', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const post = new Post({
      user: req.body.user,
      image: req.file.path,
      description: req.body.description,
    });
    const newPost = await post.save();
    io.emit('newPost', newPost); // Emit the new post to all connected clients
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a post (example for likes)
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      await post.save();
      io.emit('updatePost', post); // Emit the updated post to all connected clients
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'User already liked this post' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
