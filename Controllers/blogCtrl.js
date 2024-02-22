const { Blog, validate } = require('../Models/blog')
const mongoose = require('mongoose');


const getBlogs =  async (req, res) => {
    const blogs = await Blog.find().sort({dateAdded: -1})
    res.send(blogs);
}

const getOneBlog =  async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send("No such Blog")
        }
        const blog = await Blog.findById(id)
        if (!blog) return res.status(404).send('Blog not found')
    
        // Increment the number of views
        blog.views++;
    
        await blog.save();
        res.json(blog);
    }
    catch (error) {
        console.error('Error retrieving blog:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const blogLikes = async (req, res) => {

    const { id } = req.params

    const blog = await Blog.findById(id)
    if (!blog) return res.status(404).send('Blog not found')
    
    blog.likes++;
    
    await blog.save()
    res.send('Blog liked!');
}

const createBlog =  async (req, res) => {
    const { image, title, author, body, views, likes } = req.body;

    //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const blog = await Blog.create({image, title, author, body, views, likes })
        res.status(200).send(blog)
    }
    catch(error) {
        res.status(400).send(error.message)
    }
}

const deleteBlog = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No such Blog")
    }
    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) return res.status(404).send('Blog not found')
    res.send('blog deleted');
}

const updateBlog = async (req, res) => {
    //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No such Blog")
    }
    try {
        const blog = await Blog.findByIdAndUpdate(id, {...req.body})
        res.status(200).send(blog)
    }
    catch(error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    getBlogs,
    getOneBlog,
    blogLikes,
    createBlog,
    deleteBlog,
    updateBlog
}