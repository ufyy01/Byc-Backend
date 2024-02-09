const Joi = require('joi');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/default')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        minlength: 5,
        maxlength: 20,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255,
        validate: [isEmail, 'Please enter email']
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 15,
        required: [true, 'Please enter a phone number']
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: [true, 'Please enter a password']
    },
    isAdmin: {
        type: Boolean
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.generateAuthToken = function() {
    const maxAge = 3 * 24 * 60 * 60
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.jwtKey, {expiresIn: maxAge});
    return token;
}

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        } 
        throw Error('incorrect password');
    } 
    throw Error('incorrect email')
}

const User = mongoose.model('User', userSchema);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        email: Joi.string().required().email(),
        phone: Joi.string().min(10).max(15).required(),
        password: Joi.string().min(5).max(1024).required()
    }) 
    return schema.validate(user)
}

exports.User = User;
exports.validate = validateUser;