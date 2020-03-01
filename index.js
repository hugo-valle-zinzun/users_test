'use strict'

const app = require('./app')
const config = require('./config')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

mongoose.connect(config.db, (err, res) => {
    if (err) {
        return console.log(`Error al  conectar a la base de datos: ${err}`)
    }
    console.log('Conexion a la base de datos establecida')

    app.listen(config.port, () => {
        console.log(`API REST Corriendo en http://localhost:${config.port}`)
    })
})