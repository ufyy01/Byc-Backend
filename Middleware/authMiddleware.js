const jwt = require('jsonwebtoken');
const config = require('../config/default')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send('Acess denied. No token provided');
    try {
        const decoded = jwt.verify(token, config.jwtKey)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send(err.message)
    }
}


module.exports = requireAuth;