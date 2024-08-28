const express = require('express') ;
const router = express.Router() ;
const {newJob} = require('../controllers/jobController') ;
const isAuthenticated = require('../middlewares/auth')

router.post('/newJob',isAuthenticated,newJob)

module.exports = router ;