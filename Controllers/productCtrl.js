const { Product, validate } = require('../Models/productModel')
const mongoose = require('mongoose');


const getProducts =  async (req, res) => {
    const product = await Product.find().sort({createdAt: -1})
    if (!product) return res.status(404).send('product not found')
    res.send(product);
}

const getOneProduct =  async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No such product")
    }
    const product = await Product.findById(id)
    if (!product) return res.status(404).send('product not found')
    res.send(product);
}

const createProduct =  async (req, res) => {
    const { image, name, code, summary, description, isAvailable, price, category, tag, numberInStock } = req.body;

    //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const product = await Product.create({image, name, code, summary, description, isAvailable, price, category, tag, numberInStock })
        res.status(200).send(product)
    }
    catch(error) {
        res.status(400).send(error.message)
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No such product")
    }
    const product = await Product.findByIdAndDelete(id)
    if (!product) return res.status(404).send('product not found')
    res.send(product);
}

const updateProduct = async (req, res) => {

    //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No such product")
    }
    try {
        const product = await Product.findByIdAndUpdate(id, {...req.body})
        res.status(200).send(product)
    }
    catch(error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    getProducts,
    getOneProduct,
    createProduct,
    deleteProduct,
    updateProduct
}


