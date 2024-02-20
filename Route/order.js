const express = require('express');
const router = express.Router();
const { getOrders, getOrder, postOrder, updateOrder} = require('../Controllers/orderCtrl')


//get orders
router.get('/', getOrders)


router.get('/:orderNo', getOrder)

router.post('/', postOrder)


router.put('/:orderNo', updateOrder)

module.exports = router;