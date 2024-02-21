const express = require('express');
const router = express.Router();
const {getWishlist, postWishlist, deleteWishlistProduct } = require('../Controllers/wishlistCtrl')
// const requireAdmin = require('../Middleware/adminMiddleware')


//get cart
router.get('/:id', getWishlist)


//POST Wishlist
router.post('/', postWishlist)

//DELETE product
router.delete('/:id/:productId', deleteWishlistProduct)



module.exports = router; 