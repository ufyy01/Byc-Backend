const jwt = require('jsonwebtoken');
const config = require('../config/default')

const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token part
    
    if (!token) return res.json({ message: 'Kindly login!' });
    try {
        const decoded = jwt.verify(token, config.jwtKey)
        req.user = decoded;
        // console.log(req.user._id)
        next();
    } catch (err) {
        res.status(400).send(err.message)
    }
}


module.exports = requireAuth;