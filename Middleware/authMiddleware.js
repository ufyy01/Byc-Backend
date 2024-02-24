const jwt = require('jsonwebtoken');
const config = require('../config/default')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, config.jwtKey, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
            }
            else {
                console.log(decodedToken)
                next()
            }
        })
    }
}


module.exports = requireAuth;