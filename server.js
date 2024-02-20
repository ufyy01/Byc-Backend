const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./Route/products');
const userRouter = require('./Route/users')
const cartRouter = require('./Route/cart')
const orderRouter = require('./Route/order')
const cookieParser = require('cookie-parser')
const requireAuth = require('./Middleware/authMiddleware')
const cron = require('node-cron');
const { clearExpiredCarts } =require('./Controllers/cartCtrl')


const app = express();

app.use(express.json())
app.use(cookieParser())
// app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT, () => {console.log('Listening on port', process.env.PORT)})
})
.catch((error) => console.log(error))


app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', requireAuth, cartRouter)
app.use('/api/order', requireAuth, orderRouter)

//calling clear function to schedule the cron job to run at 00:00 (midnight) every day
cron.schedule('0 0 * * *', clearExpiredCarts);