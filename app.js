require("dotenv").config()
require("../config/databasee").connect()
const express = require('express')
const session = require('express-session')
const passport = require('passport')

const { API_PORT } = process.env
const port = process.env.PORT || API_PORT
const app = express()

app.use(express.json())

require('../config/passportt')

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }))
app.use(passport.initialize())
app.use(passport.session())

app.use(require('../routess'))

app.listen(port, () => {
    console.log(`server runing on port: ${port}`)
})