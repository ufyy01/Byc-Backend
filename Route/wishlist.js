const express = require('express');
const router = express.Router();
const {getWishlist, postWishlist, deleteWishlistProduct } = require('../Controllers/wishlistCtrl')


//get cart
router.get('/', getWishlist)


//POST Wishlist
router.post('/', postWishlist)

//DELETE product
router.delete('/:productId', deleteWishlistProduct)



module.exports = router; 