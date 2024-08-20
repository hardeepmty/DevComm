const express = require('express');
const { register, login, logout, getMyself } = require('../controllers/userController');
const isAuthenticated = require('../middlewares/auth');

const router = express.Router() ;

router.post('/register', register);
router.post('/login',login)
router.post('/logout',logout)
router.get('/getMyself',isAuthenticated,getMyself)


module.exports = router;