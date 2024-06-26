const { Cart, validate } = require('../Models/cart')
const { User } = require('../Models/user')
const { Product } = require('../Models/productModel')
const { Wishlist } = require('../Models/wishlist')



const getCart = async (req, res) => {
    const userId = req.user._id;

    let cart = await Cart.findOne({ customer: userId });
    if (!cart) {
        // If the user doesn't have a cart, create a new one
        cart = new Cart({ customer: userId });
    }

    if (cart.products.length === 0) return res.json({msg:"Your cart is empty!"})

    res.send(cart)
}


const postCart = async (req, res) => {

    const customer = req.user._id;

    const { products} = req.body;

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

        let totalSum = 0;

        //Add new products to cart
        for (const product of products) {
            const productDetails = await Product.findById(product.productId);
            if (!productDetails || productDetails.numberInStock === 0) {
                return res.status(404).send('Product not found or out of stock');
            }
            const { image, name, code, summary, price } = productDetails;
            
            totalSum = product.quantity * productDetails.price;
            
            const existingProductIndex = cart.products.findIndex(prod => 
                prod.id === product.productId && 
                prod.color === product.color &&
                prod.size === product.size
            );

            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity
                cart.products[existingProductIndex].quantity = product.quantity;
                cart.products[existingProductIndex].totalSum = product.quantity * productDetails.price;
            } 
            else {
                // Add the product to the list of cart products
                cart.products.push({
                    _id: product.productId,
                    image: image[0], 
                    name,
                    code,
                    summary,
                    price,
                    totalSum,
                    quantity: product.quantity,
                    color: product.color,
                    size: product.size
                });
            }
        }

        // Recalculate the billing based on the updated products
        let totalPrice = 0;
        for (const product of cart.products) {
            totalPrice += product.quantity * product.price;
        }
        cart.billing = totalPrice;

        // Save cart to database
        const newCart = await cart.save();
        res.status(201).json({ message:"product added to cart!"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//update cart
const updateCart = async (req, res) => {
    const customer = req.user._id;
    const { products } = req.body;
    
    try {
        const cart = await Cart.findOne({ customer });
        if (!cart) return res.status(404).send('Cart not found');

        let totalSum = 0;

        //Add new products to cart
        for (const product of products) {
            const productDetails = await Product.findById(product.productId);
            if (!productDetails || productDetails.numberInStock === 0) {
                return res.status(404).send('Product not found or out of stock');
            }
            
            totalSum = product.quantity * productDetails.price;
            
            const existingProductIndex = cart.products.findIndex(prod => 
                prod.id === product.productId && 
                prod.color === product.color &&
                prod.size === product.size
            );

            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity
                cart.products[existingProductIndex].quantity = product.quantity;
                cart.products[existingProductIndex].totalSum = product.quantity * productDetails.price;
            } 
        }

        // Recalculate the billing based on the updated products
        let totalPrice = 0;
        for (const product of cart.products) {
            totalPrice += product.quantity * product.price;
        }
        cart.billing = totalPrice;

        // Save cart to database
        const newCart = await cart.save();
        res.status(201).json({ message:"cart updated!"});
    } 
    catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).json({ message: err.message });
    }

}

//delete product from cart
const deleteCartProduct = async (req, res) => {

    const customer = req.user._id;

    const { productId } = req.params;
    
    try {
        const cart = await Cart.findOne({ customer });
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

        res.json({message: "Product removed from cart!"});
    } 
    catch (err) {
        console.error('Error deleting product from cart:', err);
        res.status(500).json({ message: err.message });
    }
}

//Move product to wishlist
const moveToWish = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user;

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ customer: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for user' });
        }

        // Find or create the user's wishlist
        let wishlist = await Wishlist.findOne({ customer: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ customer: userId, products: [] });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(product => product.id === productId);
        console.log(productIndex)
        if (productIndex !== -1) {
            // Get the price and quantity of the product being removed
            const { price, quantity } = cart.products[productIndex];

            // Remove the product from the cart
            const [product] = cart.products.splice(productIndex, 1);
            
            // Update the billing by subtracting the removed product's cost
            cart.billing -= price * quantity;

            // Add the product to the wishlist
            wishlist.products.push(product);
            
        }
        else {
            const productDetails = await Product.findById(productId);

            if (!productDetails || productDetails.numberInStock === 0) {
                return res.status(404).json({msg:'Product not found or out of stock'});
            }

            const { image, name, code, summary, price } = productDetails;

            const checkProductIndex = wishlist.products.findIndex(prod => prod.id === productId);
            if (checkProductIndex === -1) {
                // Add the product to the list of wishlist products
                wishlist.products.push({
                    _id: productId,
                    image: image[0], 
                    name,
                    code,
                    summary,
                    price
                });
            }
        }
        
        // Save the updated cart and wishlist
        await cart.save();
        await wishlist.save();

        res.json({ message: "Product moved to wishlist!" });
    }
    catch (error) {
        console.error('Error moving product to wishlist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//cron job to clear cart data after 30 days
const clearExpiredCarts = async () => {
    try {

        // Get all carts
        const carts = await Cart.find();

       // Iterate through each cart
        for (const cart of carts) {
            // Filter out expired products
            cart.products = cart.products.filter(product => {
                const creationDate = new Date(product.dateAdded);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return creationDate > thirtyDaysAgo;
            });

            // Recalculate billing based on the updated products
            let totalPrice = 0;
            for (const product of cart.products) {
                totalPrice += product.price * product.quantity;
            }
            cart.billing = totalPrice;

            // Save the updated cart
            await cart.save();
        }
    } catch (error) {
        console.error('Error clearing expired carts:', error);
    }
};


module.exports = {
    getCart,
    postCart,
    updateCart,
    deleteCartProduct,
    moveToWish,
    clearExpiredCarts
}
