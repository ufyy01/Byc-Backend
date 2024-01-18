const express = require('express');
const router = express.Router();
const { Product, validate } = require('../Models/productModel')


//GET all products
router.get('/', async (req, res) => {
    const product = await Product.find().sort({createdAt: -1})
    res.send(product);
})




//POST product
router.post('/', async (req, res) => {
    //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);

    const { name, code, description, isAvailable, price, category, tag } = req.body;
    try {
        const product = await Product.create({ name, code, description, isAvailable, price, category, tag })
        res.status(200).send(product)
    }
    catch(error) {
        res.status(400).send(error.message)
    }
})







module.exports = router;