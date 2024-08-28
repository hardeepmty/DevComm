const express = require('express') ;
const router = express.Router() ;
const {newJob, getAllJobs} = require('../controllers/jobController') ;
const isAuthenticated = require('../middlewares/auth')

router.post('/newJob',isAuthenticated,newJob)
router.get('/getJobs',isAuthenticated,getAllJobs)

module.exports = router ;