const { Order, validate } = require('../Models/order')
const { Product } = require('../Models/productModel')



const getOrders = async (req, res) => {
    try {
        const order = await Order.find().populate({
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

    try {
        //destructure req.body
        const { cartItem, company, shippingAddress, status, orderDate } = req.body;
        
        //validate with joi
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);
        
        //function for random order number
        function generateOrderNumber(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        
        const orderNo = generateOrderNumber(15)

        try {
            // Iterate through each item in cartItem
            for (const item of cartItem) {
                // Find the product and update its stock quantity
                const product = await Product.findById(item.productId).session(session);
                if (!product) {
                    throw new Error(`Product not found`);
                }

                // Check if there are enough items in stock
                if (product.numberInStock < item.quantity) {
                    throw new Error(`Insufficient stock for product with ID ${item.productId}`);
                }

                // Update the stock quantity
                product.numberInStock -= item.quantity;
                await product.save({ session });
            }

        //create new order
        const order = new Order({
            orderNo,
            cartItem,
            company,
            shippingAddress,
            status,
            orderDate
        });

        // Save the order to the database
        const newOrder = await order.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newOrder);
        } 
        catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error; // Rethrow the error to be caught by the outer catch block
        }
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