'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    nick: { type: String, required: true, unique: true },
    nombre: String,
    apellidos: String,
    password: { type: String, Select: false },
    rol: { type: String, enum: ['Admin', 'Operador', 'Administrativo'] },
    email: { type: String, unique: true, lowercase: true }
})


module.exports = mongoose.model('User', UserSchema)