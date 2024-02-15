const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteProduct } = require('../Controllers/cartCtrl')
// const requireAdmin = require('../Middleware/adminMiddleware')


//get cart
router.get('/:id', getCart)


//POST cart
router.post('/', postCart)

//DELETE product
router.delete('/:id/:productId', deleteProduct)



module.exports = router;