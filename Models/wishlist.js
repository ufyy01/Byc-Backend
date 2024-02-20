const mongoose = require('mongoose');
const Joi = require('joi');

const wishlistSchema = new mongoose.Schema({
    customer: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[ {
        type: new mongoose.Schema({
            image: {
                type: String
            },
            name: {
                type: String,
                minlength: 4,
                maxlength: 25,
            },
            code: {
                type: String,
            },
            summary: {
                type: String,
                minlength: 10,
                maxlength: 100,
            },
            price: {
                type: Number,
            },
            totalSum: {
                type: Number
            },
            color: {
                type: String
            },
            size: {
                type: String,
                enum: ['s', 'm','l','xl']
            },
            quantity: {
                type: Number,
                default: 1,
                max: 10
            }
        }),
        required: true
    }],
}, {timestamps:true})


const Wishlist = mongoose.model('Wishlist', wishlistSchema);


function validateWishlist(wishlist) {
    const schema = Joi.object({
        customer: Joi.objectId().required(),
        products: Joi.array().required(),
    }) 
    return schema.validate(wishlist)
}

exports.Wishlist = Wishlist;
exports.validate = validateWishlist;