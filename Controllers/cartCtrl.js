const { Cart, validate } = require('../Models/cart')
const { User } = require('../Models/user')
const { Product } = require('../Models/productModel')


const getCart = async (req, res) => {
    const cart = await Cart.findById(req.params.id)
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


        // Check product availability and calculate total price
        let totalPrice = 0;
        const cartProducts = [];

        for (const product of products) {
            const productDetails = await Product.findById(product.productId);
            if (!productDetails || productDetails.numberInStock === 0) {
                return res.status(404).send('Product not found or out of stock');
            }
            const { image, name, code, summary, price } = productDetails;

            // Calculate the total price for this product
            const productTotalPrice = price * product.quantity;
            totalPrice += productTotalPrice;

            // Add the product to the list of cart products
            cartProducts.push({
                _id: product.productId,
                image: image[0], // Assuming image is an array, take the first image
                name,
                code,
                summary,
                price,
                quantity: product.quantity,
                color: product.color,
                size: product.size
            });
        }

        // Create cart object
        const cart = new Cart({
            customer,
            products: cartProducts,
            billing: totalPrice
        });

        // Save cart to database
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete product from cart
const deleteProduct = async (req, res) => {

    console.log(req.params)

    const { cartId, productId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        console.error(`Cart not found for ID: ${cartId}`);
        if (!cart) return res.status(404).send('Cart not found');

        // Find the index of the product to remove
        const productIndex = cart.products.findIndex(product => product._id === productId);

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





module.exports = {
    getCart,
    postCart,
    deleteProduct
}
