const { Wishlist, validate } = require('../Models/wishlist')
const { User } = require('../Models/user')
const { Product } = require('../Models/productModel')




const getWishlist = async (req, res) => {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ customer: userId })
    res.send(wishlist)
}


const postWishlist = async (req, res) => {

    const { products } = req.body;
    const customer = req.user._id;


    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Find user by ID
        const user = await User.findById(customer);
        if (!user) return res.status(404).send('Invalid user');

        // Check if the user already has a wishlist
        let wishlist = await Wishlist.findOne({ customer });

        if (!wishlist) {
            // If the user doesn't have a wishlist, create a new one
            wishlist = new Wishlist({ customer });
        }

        //Add new products to wishlist
        for (const product of products) {
            const productDetails = await Product.findById(product.productId);

            if (!productDetails || productDetails.numberInStock === 0) {
                return res.status(404).json({msg:'Product not found or out of stock'});
            }

            const { image, name, code, summary, price } = productDetails;

            const checkProductIndex = wishlist.products.findIndex(prod => prod.id === product.productId);
            if (checkProductIndex === -1) {
                // Add the product to the list of wishlist products
                wishlist.products.push({
                    _id: product.productId,
                    image: image[0], 
                    name,
                    code,
                    summary,
                    price
                });
            }
        }

        // Save wishlist to database
        const newWishlist = await wishlist.save();
        res.status(201).json({msg:'Product added to wishlist!'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//delete product from wishlist
const deleteWishlistProduct = async (req, res) => {

    const customer = req.user._id;
    
    const { productId } = req.params;
    
    try {
        const wishlist = await Wishlist.findOne({ customer });
        if (!wishlist) return res.status(404).send('wishlist not found');

        // Find the index of the product to remove
        const productIndex = wishlist.products.findIndex(product => product.id === productId);

        // If the product is not found in the wishlist, return 404
        if (productIndex === -1) {
        console.error(`Product not found in wishlist for ID: ${productId}`);
        return res.status(404).send('Product not found in wishlist');
        }

        // Remove the product from the wishlist's product array
        wishlist.products.splice(productIndex, 1);

        // Save the updated wishlist
        const updatedWishlist = await wishlist.save();

        res.json({msg: 'Product removed from wishlist!'});
    } 
    catch (err) {
        console.error('Error deleting product from wishlist:', err);
        res.status(500).json({ message: err.message });
    }
}

const clearExpiredWishlist = async () => {
    try {

        // Get all wishlists
        const wishlists = await Wishlist.find();

       // Iterate through each wishlist
        for (const wishlist of wishlists) {
            // Filter out expired products
            wishlist.products = wishlist.products.filter(product => {
                const creationDate = new Date(product.dateAdded);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 1);
                return creationDate > thirtyDaysAgo;
            });

            // Save the updated wishlist
            await wishlist.save();
        }
    } catch (error) {
        console.error('Error clearing expired wishlists:', error);
    }
};


module.exports = {
    getWishlist,
    postWishlist,
    deleteWishlistProduct,
    clearExpiredWishlist
}