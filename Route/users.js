const express = require('express');
const router = express.Router();
const { signup_post, login_post } = require('../Controllers/userCtrl')



router.post('/signup', signup_post)
router.post('/login', login_post)



module.exports = router;