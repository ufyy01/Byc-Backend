const { User, validate } = require('../Models/user')




//Handle Errors

const handleErrors = (err) => {
    let errors = {email: '', password: ''}

    //incorrect email and password during login
    if(err.message === 'incorrect email') {
        errors.email = 'That email is not registered'
    }
    if(err.message === 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    //Duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors
    }

    //Validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    

    return errors
}

//JWT function 
const maxAge = 3 * 24 * 60 * 60

// const createToken = (id) => {
//     // { _id: this._id, isAdmin: this.isAdmin }
//     return jwt.sign({ id }, config.jwtKey, {expiresIn: maxAge})
// }


module.exports.signup_post = async (req, res) => {

     //Joi validation
    const { error } = validate(req.body, {abortEarly: false})
    if (error) return res.status(400).send(error.details[0].message);
    
    const { name, email, phone, password} = req.body;
    
    try{
        const user = await User.create({ name, email, phone, password })
        const token = user.generateAuthToken()
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})

        res.header('x-auth-token', token).send({user: user._id, name, email, phone }) //find a way to display id without lodash
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = user.generateAuthToken()
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).header('x-auth-token', token).json({user: user._id})
    }
    catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1}).send("You've been logged out")
}