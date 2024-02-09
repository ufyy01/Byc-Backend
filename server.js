const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./Route/products');
const userRouter = require('./Route/users')
const cookieParser = require('cookie-parser')

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
app.use('/api/users', userRouter);
