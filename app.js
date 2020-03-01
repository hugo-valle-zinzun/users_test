'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const api = require('./routes')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', api)
app.use('/public', express.static('static'));
// Se indica el directorio donde se almacenarán las plantillas 
app.set('views', './views');
app.set('view engine', 'pug');


module.exports = app