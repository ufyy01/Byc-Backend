const mongoose = require('mongoose')
const Joi = require('joi')

const orderSchema = new mongoose.Schema({
    orderNo: {
        type : String,
        required: true
    },
    cartItem: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true 
    },
    company: {
        type: String,
    },
    shippingAddress: {
        country: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed','cancelled', 'shipped', 'completed'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {timestamps:true})

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
    const schema = Joi.object({
        cartItem: Joi.objectId().required(),
        company: Joi.string(),
        shippingAddress: Joi.object({
            country: Joi.string().required(),
            town: Joi.string().required(),
            state: Joi.string().required() 
        }).required(),
        status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'shipped', 'completed').default('pending'),
        orderDate: Joi.date().default(Date.now)
    }) 
    return schema.validate(order)
}

exports.Order = Order;
exports.validate = validateOrder;