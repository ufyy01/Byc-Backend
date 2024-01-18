const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const productSchema = new Schema({
    // image: {
    //     type: String,
    //     required: true
    // },
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
    description: {
        type: String,
        minlength: 10,
        maxlength: 50,
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
        enum: ['boxers', 'camisole','pants','T-shirt', 'singlet','towels']
    }
}, {timestamps:true})

const Product = mongoose.model('Product', productSchema);


function validateProduct(product) {
    const schema = Joi.object({
        // image: Joi.string().required(),
        name: Joi.string().min(4).max(25).required(),
        code: Joi.string().required(),
        description: Joi.string().min(10).max(50).required(),
        isAvailable: Joi.boolean().required(),
        price: Joi.number().when('isAvailable', {
            is: true,
            then: Joi.number().required(),
            otherwise: Joi.number().optional()
        }
        ),
        category: Joi.string().required(),
        tag: Joi.string().required(),
    }) 
    return schema.validate(product)
}

exports.Product = Product;
exports.validate = validateProduct;