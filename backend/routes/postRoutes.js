const express = require('express');
const router = express.Router();
const { newPost, getUserPosts, getPostById, getAllPosts, likePost, unlikePost, comment, getPostsByUserId } = require('../controllers/postController');
const isAuthenticated = require('../middlewares/auth');

router.post('/newPost', isAuthenticated, newPost);
router.get('/userPosts', isAuthenticated, getUserPosts);
router.get('/post/:postId', isAuthenticated, getPostById);
router.get('/allPosts', isAuthenticated, getAllPosts);
router.post('/like/:postId',isAuthenticated,likePost)
router.post('/unlike/:postId', isAuthenticated, unlikePost)
router.post('/comment/:postId', isAuthenticated, comment)
router.get('/user/:userId/posts',isAuthenticated ,getPostsByUserId);


module.exports = router;
