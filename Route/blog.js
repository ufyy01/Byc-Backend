const express = require('express');
const router = express.Router();
const { getBlogs, getOneBlog, blogLikes, createBlog, deleteBlog, updateBlog } = require('../Controllers/blogCtrl')
const requireAuth = require('../Middleware/authMiddleware')
const requireAdmin = require('../Middleware/adminMiddleware')




//GET all Blogs
router.get('/', getBlogs)

//GET one Blog
router.get('/:id', getOneBlog)

//LIKE blog
router.get('/like/:id', blogLikes)

//POST Blog
router.post('/', [requireAuth, requireAdmin], createBlog)

//DELETE one Blog
router.delete('/:id', [requireAuth, requireAdmin], deleteBlog)

//UPDATE one Blog
router.put('/:id', [requireAuth, requireAdmin], updateBlog)





module.exports = router;