const mongoose = require('mongoose')
const Joi = require('joi')

const blogSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        minlength: 15,
        maxlength: 50,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        minlength: 20,
        required: true
    },
    views: {
        type: Number,
        min: 0,
        default: 0
    },
    likes: {
        type: Number,
        min: 0,
        default: 0
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const Blog = mongoose.model('Blog', blogSchema)

function validateBlog(blog) {
    const schema = Joi.object({
        image: Joi.string().required(),
        title: Joi.string().min(15).max(50).required(),
        author: Joi.string().required(),
        body: Joi.string().min(20).required(),
    }) 
    return schema.validate(blog)
}

exports.Blog = Blog;
exports.validate = validateBlog;