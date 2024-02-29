const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const productRouter = require('./Route/products');
const userRouter = require('./Route/users')
const cartRouter = require('./Route/cart')
const orderRouter = require('./Route/order')
const wishlistRouter = require('./Route/wishlist')
const blogRouter = require('./Route/blog')

const cookieParser = require('cookie-parser')
const requireAuth = require('./Middleware/authMiddleware')
const checkUser = require('./Middleware/checkUser')
const cron = require('node-cron');
const { clearExpiredCarts } =require('./Controllers/cartCtrl')
const { clearExpiredWishlist } =require('./Controllers/wishlistCtrl')


const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
}))
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

app.get('*', checkUser)

app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/blog', blogRouter)

//calling clear cart function to schedule the cron job to run at 00:00 (midnight) every day
cron.schedule('0 0 * * *', clearExpiredCarts);

//calling clear wishlist function to schedule the cron job to run at 00:00 (midnight) every day
cron.schedule('0 0 * * *', clearExpiredWishlist);