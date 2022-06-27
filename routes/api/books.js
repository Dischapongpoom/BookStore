const express = require('express')
const auth = require('../../middleware/auth')
const userModel = require('../../model/user')
const bookModel = require('../../model/book')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_KEY

const router = express.Router()

router.param('book', (req, res, next, slug) => {
    bookModel.findOne({ slug: slug })
        .populate('author')
        .then((book) => {
            if (!book) return res.status(400).json({ error: { message: "Book not found" } })
            req.book = book

            next()
        }).catch(next)
})

// Get Listbook by parameter
router.get('/', async (req, res, next) => {
    req.query.publish = true
    const filters = req.query;

    await bookModel.find({}).then((book) => {
        const filteredBook = book.filter(value => {
            let isValid = true;
            for (key in filters) {
                isValid = isValid && value[key] == filters[key];
            }
            return isValid;
        });
        return res.status(200).json({
            BookList: filteredBook.map((book) => {
                return book.toPreviweFor()
            })
        })
    })
    res.status(500)
})

// get book By id
router.get('/:book', auth.optional, async (req, res, next) => {
    let book = new bookModel(req.book)
    if (!req.book.publish) {
        if (req.headers && req.headers.authorization) {

            let decoded
            const authorization = req.headers.authorization.split(' ')[1]

            try {
                decoded = jwt.verify(authorization, secret)
            } catch (error) {
                return res.status(401).send('unauthorized')
            }
            const userId = decoded.id
            
            userModel.findById(userId).then((user) =>{
                book.createBy = user

                if (book.createBy._id.toString() === userId){
                    return res.status(200).json({ book: book.toPreviweFor() })
                }
            })
        }else{
            return res.status(400).json({ error: { message: "Book not found" } })
        }
    }else{
        return res.status(200).json({ book: book.toPreviweFor() })
    }
    

})

// Create
router.post('/', auth.require, (req, res, next) => {
    if (!req.body.book.title) {
        return res.status(422).json({ error: { title: "can't be black" } })
    }
    if (Math.sign(req.body.book.price) === -1) {
        return res.status(422).json({ error: { price: "price minimum is 0" } })
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
            if (!user) res.sendStatus(401)

            if (user.user === '_Darth Vader_' || user.author === '_Darth Vader_' || user.pseudonym === '_Darth Vader_') {
                return res.status(400).json({ error: { message: "_Darth Vader_ can't publish the book" } })
            }

            let book = new bookModel(req.body.book)
            book.createBy = user
            book.author = user.author
            book.pseudonym = user.pseudonym
            

            return book.save().then(() => {
                return res.status(200).json({ book: book.toJSONFor() })
            })
        })
    }
    return res.status(500);
})

// Edit/ Update 
router.put('/:book', auth.require, (req, res, next) => {
    if (req.headers && req.headers.authorization && req.body.book) {
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
            if (!user) res.sendStatus(401)
            let book = new bookModel(req.body.book)
            book.createBy = user

            if (req.book.createBy._id.toString() === userId) {
                if (req.body.book.title) {
                    book.title = req.body.book.title
                    book.slug = book.slugify()
                }
                if (req.body.book.description) {
                    book.description = req.body.book.description
                }
                if (req.body.book.price) {
                    book.price = req.body.book.price
                }
                if (req.body.book.image) {
                    book.image = req.body.book.image
                }
                if (req.body.book.publish) {
                    book.publish = req.body.book.publish
                }

               book.save().then(() => {
                    return res.status(200).json({ book: book.toJSONFor() })
                }).catch(next)
            } else {
                return res.status(403).json({ error: { message: "you can only edit your book" } })
            }
        })
    }
    return res.status(500);
})

// Delete
router.delete('/:book', auth.require, (req, res, next) => {
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
            if (!user) res.sendStatus(401)
            let book = new bookModel(req.body.book)
            book.createBy = user

            if (book.createBy._id.toString() === userId) {
                book.remove().then(() => {
                    return res.status(204).json({ message: "delete success" })
                }).catch(next)
            } else {
                return res.status(403).json({ error: { message: "you can only delete your book" } })
            }
        })
    }
    return res.status(500);
})

module.exports = router;
