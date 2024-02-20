const { Cart, validate } = require('../Models/cart')
const { User } = require('../Models/user')
const { Product } = require('../Models/productModel')



const getCart = async (req, res) => {
    const cart = await Cart.findById(req.params.id).populate({
        path: 'customer',
        select: '-password'
    })
    res.send(cart)
}


const postCart = async (req, res) => {

    const { customer, products} = req.body;

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Find user by ID
        const user = await User.findById(customer);
        if (!user) return res.status(404).send('Invalid user');

        // Check if the user already has a cart
        let cart = await Cart.findOne({ customer });

        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = new Cart({ customer });
        }

        //Add new products to cart
        for (const product of products) {
            const productDetails = await Product.findById(product.productId);
            if (!productDetails || productDetails.numberInStock === 0) {
                return res.status(404).send('Product not found or out of stock');
            }
            const { image, name, code, summary, price } = productDetails;


            // Add the product to the list of cart products
            cart.products.push({
                _id: product.productId,
                image: image[0], 
                name,
                code,
                summary,
                price,
                quantity: product.quantity,
                color: product.color,
                size: product.size
            });
        }

        // Recalculate the billing based on the updated products
        let totalPrice = 0;
        for (const product of cart.products) {
            totalPrice += product.price * product.quantity;
        }
        cart.billing = totalPrice;

        // Save cart to database
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete product from cart
const deleteCartProduct = async (req, res) => {

    
    const { id, productId } = req.params;
    
    try {
        const cart = await Cart.findById(id);
        if (!cart) return res.status(404).send('Cart not found');

        // Find the index of the product to remove
        const productIndex = cart.products.findIndex(product => product.id === productId);

        // If the product is not found in the cart, return 404
        if (productIndex === -1) {
        console.error(`Product not found in cart for ID: ${productId}`);
        return res.status(404).send('Product not found in cart');
        }

         // Get the price and quantity of the product being removed
        const { price, quantity } = cart.products[productIndex];

        // Remove the product from the cart's product array
        cart.products.splice(productIndex, 1);

        // Update the billing by subtracting the removed product's cost
        cart.billing -= price * quantity;

        // Save the updated cart
        const updatedCart = await cart.save();

        res.json(updatedCart);
    } 
    catch (err) {
        console.error('Error deleting product from cart:', err);
        res.status(500).json({ message: err.message });
    }
}


//cron job to clear cart data after 30 days
const clearExpiredCarts = async () => {
    try {
        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find carts that were last updated more than 30 days ago
        const expiredCarts = await Cart.find({ updatedAt: { $lt: thirtyDaysAgo } });

        // Clear products from expired carts
        for (const cart of expiredCarts) {
            cart.products = [];
            cart.billing = 0;
            await cart.save();
        }

        console.log('Expired carts cleared successfully.');
    } catch (error) {
        console.error('Error clearing expired carts:', error);
    }
};




module.exports = {
    getCart,
    postCart,
    deleteCartProduct,
    clearExpiredCarts
}
