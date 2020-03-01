'use strict'
const express = require('express')
const UserCtrl = require('../controllers/user')
const api = express.Router()

//api.get('/', (req, res) => { res.render('home.pug', {}); });

api.get('/', UserCtrl.getUsers)

api.get('/getAddUser', UserCtrl.getAddUser)
api.post('/user', UserCtrl.saveUser)

api.get('/user/:userId', UserCtrl.getUser)
api.put('/user/:userId', UserCtrl.updateUser)

api.delete('/user/:userId', UserCtrl.deleteUser)
api.get('/rolescount', UserCtrl.getRolesCount)

api.get('/hello', (req, res) => {
    res.render('hello.pug', { mensaje: 'Usando Pug JS en Express' }); // Se muestra la plantilla hello.pug
});

module.exports = api