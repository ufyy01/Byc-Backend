const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const productSchema = new Schema({
    image: {
        type: [{
            type: String,
            trim: true
        }],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A product should have at least one image!'
        }
    },
    name: {
        type: String,
        minlength: 4,
        maxlength: 25,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        minlength: 10,
        maxlength: 100,
        required: true  
    },
    description: {
        type: String,
        minlength: 10,
        required: true
    },
    isAvailable: Boolean,
    price: {
        type: Number,
        required: function() {return this.isAvailable}
    },
    category : {
        type: String,
        required: true,
        enum: ['men', 'women','children']
    },
    tag : {
        type: String,
        required: true,
        enum: ['boxers', 'camisole','pants','t-shirt', 'singlet','towels']
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
    }
}, {timestamps:true})

const Product = mongoose.model('Product', productSchema);


function validateProduct(product) {
    const schema = Joi.object({
        image: Joi.array(),
        name: Joi.string().min(4).max(25).required(),
        code: Joi.string().required(),
        summary: Joi.string().min(10).max(100).required(),
        description: Joi.string().min(10).required(),
        isAvailable: Joi.boolean().required(),
        price: Joi.number().when('isAvailable', {
            is: true,
            then: Joi.number().required(),
            otherwise: Joi.number().optional()
        }
        ),
        category: Joi.string().required(),
        tag: Joi.string().required(),
        numberInStock: Joi.number().min(0).required()
    }) 
    return schema.validate(product)
}

exports.Product = Product;
exports.validate = validateProduct;