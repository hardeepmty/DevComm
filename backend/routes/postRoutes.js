const express = require('express');
const router = express.Router();
const { newPost, getUserPosts, getPostById, getAllPosts } = require('../controllers/postController');
const isAuthenticated = require('../middlewares/auth');

// Create a New Post
router.post('/newPost', isAuthenticated, newPost);

// Get All Posts by the Logged-In User
router.get('/userPosts', isAuthenticated, getUserPosts);

// Get a Post by ID
router.get('/post/:postId', isAuthenticated, getPostById);

// Get All Posts
router.get('/allPosts', isAuthenticated, getAllPosts);

module.exports = router;
