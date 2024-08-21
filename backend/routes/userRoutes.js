const express = require('express');
const { register, login, logout, getMyself, editProfile, getUsers } = require('../controllers/userController');
const isAuthenticated = require('../middlewares/auth');

const router = express.Router() ;

router.post('/register', register);
router.post('/login',login)
router.post('/logout',logout)
router.get('/getMyself',isAuthenticated,getMyself)
router.patch('/edit',isAuthenticated,editProfile)
router.get('/getUsers',isAuthenticated,getUsers)


module.exports = router;