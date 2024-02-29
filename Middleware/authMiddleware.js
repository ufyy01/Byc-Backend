const jwt = require('jsonwebtoken');
const config = require('../config/default')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, config.jwtKey)
        req.user = decoded;
        console.log(req.user)
        next();
    } catch (err) {
        res.status(400).send(err.message)
    }
}


module.exports = requireAuth;