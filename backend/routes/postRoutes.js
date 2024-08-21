const express = require('express');
const router = express.Router();
const { newPost, getUserPosts, getPostById, getAllPosts } = require('../controllers/postController');
const isAuthenticated = require('../middlewares/auth');

router.post('/newPost', isAuthenticated, newPost);
router.get('/userPosts', isAuthenticated, getUserPosts);
router.get('/post/:postId', isAuthenticated, getPostById);
router.get('/allPosts', isAuthenticated, getAllPosts);

module.exports = router;
