const express = require('express');
const router = express.Router();
const { getOrders, getOrder, postOrder, updateOrder} = require('../Controllers/orderCtrl')
const requireAuth = require('../Middleware/authMiddleware')



//get orders
router.get('/', requireAuth, getOrders)


router.get('/:orderNo', requireAuth, getOrder)

router.post('/', requireAuth, postOrder)


router.put('/:orderNo', requireAuth, updateOrder)

module.exports = router;