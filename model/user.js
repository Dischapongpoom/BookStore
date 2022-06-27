const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_KEY

const userModel = new mongoose.Schema({
    user: { type: String, maxLength: 20 },
    author: { type: String },
    pseudonym: { type: String },
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"],  match: [/^[a-zA-Z0-9]+$/, 'is invalid'] },
    hash: String,
    salt: String
}, { timestamps: true })

userModel.path('user').validate(function (v) {
    return v.length <= 20;
}, 'The maximum length is 20.');

// Check username
userModel.plugin(uniqueValidator, { message: 'is already taken.' })

// Hash password
userModel.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex')
}

// Validate Password
userModel.methods.validPassword = function (password) {
    const hashs = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex')
    return (this.hash === hashs)
}

// Get Token
userModel.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
    }, secret, { expiresIn: '1h' })
}

//Return Token
userModel.methods.toAuthJSON = function () {
    return {
        username: this.username,
        user: this.user,
        author: this.author,
        token: this.generateJWT(),
    }
}

//Get Profile
userModel.methods.toProfileJSONFor = function () {
    return {
        user: this.user,
        author: this.author,
        pseudonym: this.pseudonym,
        username: this.username
    }
}

module.exports = mongoose.model("User", userModel);
