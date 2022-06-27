const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const slug = require('slug')

const bookSchema = new mongoose.Schema({
    slug: { type: String, lowercase: true, unique: true },
    title: { type: String, required: [true, "can't be blank"]},
    description: String,
    author: String,
    pseudonym: String,
    price: { type: Number, min: [0, 'Price must be positive '] },
    publish: { type: Boolean, default: true },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
})

bookSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slugify()
    }
    next()
})

bookSchema.methods.slugify = function () {
    this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
}

bookSchema.methods.changePublish = function() {
    this.publish = !this.publish
}

bookSchema.methods.toJSONFor = function (user) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        price: this.price,
        author: this.author,
        pseudonym: this.pseudonym,
        publish: this.publish,
        createBy: this.createBy.toProfileJSONFor(user),
        image: String,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

bookSchema.methods.toPreviweFor = function () {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        price: this.price,
        author: this.author,
        pseudonym: this.pseudonym,
    }
}

bookSchema.plugin(uniqueValidator, { message: 'is already taken' })

module.exports = mongoose.model("Book", bookSchema);