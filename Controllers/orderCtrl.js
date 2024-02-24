const { Order, validate } = require('../Models/order')
const { Product } = require('../Models/productModel')
const { Cart } = require('../Models/cart')

const getOrders = async (req, res) => {
    try {
        const order = await Order.find().populate();
        if (!order) return res.status(404).send('No order has been placed');
    
        res.send(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getOrder = async (req, res) => {
    try {
        const { orderNo } = req.params

        const order = await Order.findOne({ orderNo }).populate({
            path: 'cartItem',
            populate: {
                path: 'customer',
                select: '-password',
                model: 'User'
            }
        });
        if (!order) return res.status(404).send('No order has been placed');
    
        res.send(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const postOrder = async (req, res) => {
    const userId = req.user._id;

    try {
        //destructure req.body
        const { cartItem, company, shippingAddress, status, orderDate } = req.body;
        
        //validate with joi
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);
        
        // Retrieve the cart using the provided cart ID
        const cart = await Cart.findOne({ customer: userId }).populate('products');
        if (!cart) return res.status(404).send('Cart not found');

        // Extract the product IDs and quantities associated with the retrieved cart
        const productsToUpdate = cart.products.map(product => ({
            productId: product._id,
            quantity: product.quantity
        }));

        cart.products = [];
        cart.billing = 0;
        cart.save()

        // Update the stock quantity for each product
        for (const { productId, quantity } of productsToUpdate) {
            const product = await Product.findById(productId);
            if (!product) continue; // Skip if product not found
            
            // Check if there are enough items in stock
            if (product.numberInStock < quantity) {
                return res.status(400).send(`Insufficient stock`);
            }

            // Update the stock quantity
            product.numberInStock -= quantity;
            await product.save();
        }
        
        //function for random order number
        function generateOrderNumber(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        
        //create new order
        const order = new Order({
            orderNo: generateOrderNumber(15),
            cartItem,
            company,
            shippingAddress,
            status,
            orderDate
        });

        // Save the order to the database
        const newOrder = await order.save();

        // Commit the transaction
        res.status(201).json(newOrder);
    } 
    catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const updateOrder = async (req, res) => {

    //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const order = await Order.findOneAndUpdate(req.params, {...req.body})
        res.status(200).send(order)
    }
    catch(error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    getOrders,
    getOrder,
    postOrder,
    updateOrder
}