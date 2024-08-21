const express = require('express');
const { register, login, logout, getMyself, editProfile, getUsers, followUser, unfollowUser, getUserProfile } = require('../controllers/userController');
const isAuthenticated = require('../middlewares/auth');

const router = express.Router() ;

router.post('/register', register);
router.post('/login',login)
router.post('/logout',logout)
router.get('/getMyself',isAuthenticated,getMyself)
router.patch('/edit',isAuthenticated,editProfile)
router.get('/getUsers',isAuthenticated,getUsers)
router.post('/follow',isAuthenticated,followUser)
router.post('/unfollow',isAuthenticated,unfollowUser)
router.get('/getUser/:id',isAuthenticated, getUserProfile);


module.exports = router;