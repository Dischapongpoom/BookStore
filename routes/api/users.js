const express = require('express')
const jwt = require('jsonwebtoken')
const userModel = require('../../model/user')
const auth = require('../../middleware/auth')
const passport = require('passport')
const router = express.Router()
const secret = process.env.JWT_KEY

router.param('user', (req, res, next, username) => {
    userModel.findOne({ username: username })
        .populate('author')
        .then((user) => {
            if (!user) return res.status(400).json({ error: { message: "user not found" } })
            req.user = user
            next()
        }).catch(next)
})

router.get('/:user', (req, res) => {
    res.status(200).json({ Profile: req.user.toProfileJSONFor() })
})

// Get Current User
router.get('/', auth.require, (req, res, next) =>{
    if (req.headers && req.headers.authorization) {
        let decoded
        const authorization = req.headers.authorization.split(' ')[1]
        try {
            decoded = jwt.verify(authorization, secret)
        } catch (error) {
            console.log("errror: ", error)
            return res.status(401).send('unauthorized')
        }
        const userId = decoded.id
        userModel.findById(userId).then((user) => {

            res.json({ user: user.toProfileJSONFor() })
            
        }).catch(next)
    }
})

// Register
router.post('/register', async (req, res, next) => {

    if (!req.body.user) {
        return res.status(422).json({ error: { user: "can't be black" } })
    }
    if (!req.body.user.username) {
        return res.status(422).json({ error: { email: "can't be black" } })
    }
    if (!req.body.user.password) {
        return res.status(422).json({ error: { password: "can't be black" } })
    }
    if (!req.body.user.author) {
        return res.status(422).json({ error: { author: "can't be black" } })
    }
    if (!req.body.user.pseudonym) {
        return res.status(422).json({ error: { pseudonym: "can't be black" } })
    }

    const user = new userModel()
    const username = req.body.user.username
    const DupUsername = await userModel.findOne({ username })

    if (DupUsername) return res.status(400).json({ error: { message: "This username is alreay taken" } })

    user.username = req.body.user.username
    user.user = req.body.user.user
    user.author = req.body.user.author
    user.pseudonym = req.body.user.pseudonym

    await user.setPassword(req.body.user.password)
    await user.save().then(() => {
        res.status(200).json({ user: user.toProfileJSONFor() })
    })
})

// Login
router.post('/login', async (req, res, next) => {
    if (!req.body.user.username) {
        return res.status(422).json({ error: { username: "can't be black" } })
    }
    if (!req.body.user.password) {
        return res.status(422).json({ error: { password: "can't be black" } })
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)

        if (user) {
            return res.status(200).json({ user: user.toAuthJSON() })
        } else {
            return res.status(422).json(info)
        }
    })(req, res, next)
})

// Edit User
router.put('/edit', auth.require, (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        let decoded
        const authorization = req.headers.authorization.split(' ')[1]

        try {
            decoded = jwt.verify(authorization, secret)
        } catch (error) {
            console.log("errror: ", error)
            return res.status(401).send('unauthorized')
        }
        const userId = decoded.id
        userModel.findById(userId).then((user) => {
            if (!user) res.status(401).json({error: { message: "Can't find user" }})

            if (!req.body.user){
                res.status(401).json({error: { message: "body is empty" }})
            }

            if (req.body.user.user) {
                user.user = req.body.user.user
            }
            if (req.body.user.author) {
                user.author = req.body.user.author
            }
            if (req.body.user.pseudonym) {
                user.pseudonym = req.body.user.pseudonym
            }
            user.save().then(() => {
                res.json({ user: user.toProfileJSONFor() })
            })
        }).catch(next)
    }
})

// Change Password
router.put('/change_password', auth.require, (req, res, next) => {

    if (!req.body.user.oldpassword || !req.body.user.newpassword || !req.body.user.confirmpassword) {
        return res.status(422).json({ error: { message: "Password can't be black" } })
    }
    if (req.body.user.newpassword !== req.body.user.confirmpassword) {
        return res.status(422).json({ error: { message: "Passwords do not match" } })
    }

    if (req.headers && req.headers.authorization) {
        let decoded
        const authorization = req.headers.authorization.split(' ')[1]

        try {
            decoded = jwt.verify(authorization, secret)
        } catch (error) {
            console.log("errror: ", error)
            return res.status(401).send('unauthorized')
        }
        const userId = decoded.id

        userModel.findById(userId).then((user) => {
            if (user.validPassword(req.body.user.oldpassword)) {
                user.setPassword(req.body.user.newpassword)
                user.save().then(() => {
                    return res.status(200).json({ message: "Change password success" })
                })
            } else {
                return res.status(400).json({ error: { message: "Old Password Invalid" } })
            }
        })
    }
    return res.status(500);
})

module.exports = router;
