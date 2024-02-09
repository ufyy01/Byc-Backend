const express = require('express');
const router = express.Router();
const { signup_post, login_post, logout_get } = require('../Controllers/userCtrl')



router.post('/signup', signup_post)
router.post('/login', login_post)
router.get('/logout', logout_get)


module.exports = router;