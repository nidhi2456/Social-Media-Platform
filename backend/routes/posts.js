const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// Post a new message
router.post('/', auth, async (req, res) => {
    const { text } = req.body;
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = {
            text,
            name: user.username,
            user: req.user.id,
            likes: req.body.likes,
            comments: req.body.comments
        };
        const post = new Post(newPost);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Like a post
router.put('/like/:postId',auth , async (req, res) => {
    console.log("this api is hiting")
    // console.log(req)
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
    //   console.log(post)
  
      // Check if the post has already been liked by this user
      console.log(req.user.id)
      if (post.likes.some(like => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
  
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Comment on a post
  router.put('/comment/:postId',auth,  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
    
      const { text } = req.body;
      const user = await User.findById(req.user.id).select('-password');
  
      const newComment = {
        text,
        name: user.username,
        user: req.user.id,
        date: Date.now()
      };
  
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;