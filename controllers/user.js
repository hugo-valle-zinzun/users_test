'use strict'

const User = require('../models/user')

const roles = ['Admin', 'Operador', 'Administrativo']

function getUsers(req, res) {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion: ${err}` })
        if (!users) return res.status(200).send({ status: false, message: `No existen usuarios` })
            //return res.status(200).send({ users })

        return res.render('getUsers.pug', { users: users });
    })
}

function getAddUser(req, res) {
    return res.render('getAddUser.pug', {});
}

function saveUser(req, res) {
    //variables iniciales
    let user = new User()
    let saveFlag = true;
    let userCompFlag = { nick: false, email: false }
    let errorMessages = [];

    user.nick = req.body.nick
    user.nombre = req.body.nombre
    user.apellidos = req.body.apellidos
    user.password = req.body.password
    user.rol = req.body.rol
    user.email = req.body.email

    // se realiza una consulta inicial de usuarios que puedan contener el nick o el email capturados
    User.find({ $or: [{ nick: user.nick }, { email: user.email }] }, (err, users) => {
        if (err) {
            return res.status(500).send({ message: `Error al realizar la peticion: ${err}` })
        }
        // Se valida que el nick haya sido capturado
        if (user.nick.length <= 0) {
            saveFlag = false;
            errorMessages.push('Debe capturar el Nick')
        }

        // Se valida que el nick solo contenga valores alfanumericos y el guion bajo
        if (/[^0-5a-z_]/g.test(user.nick.toLowerCase())) {
            saveFlag = false;
            errorMessages.push('El nick solo puede contener valores alfanumericos y guiones bajos: "' + user.nick + '".')
        }

        // Se valida que el primer  digito del nick sea una letra o guion bajo
        if (/[^a-z_]/g.test(user.nick.substring(0, 1).toLowerCase())) {
            saveFlag = false;
            errorMessages.push('El nick solo puede iniciar con un guion bajo o una letra: "' + user.nick + '".')
        }

        // Se valida que el nombre haya sido capturado
        if (user.nombre.length <= 0) {
            saveFlag = false;
            errorMessages.push('Debe capturar el Nombre')
        }

        // Se valida que el password haya sido capturado
        if (user.password.length <= 0) {
            saveFlag = false;
            errorMessages.push('Debe capturar el Usuario')
        }

        // Se valida que el rol recibido corresponda a los indicados en el array de roles
        if (!roles.includes(user.rol)) {
            saveFlag = false;
            errorMessages.push('El rol ' + user.rol + ' no es valido')
        }

        // Se valida que el email haya sido capturado
        if (user.email.length <= 0) {
            saveFlag = false;
            errorMessages.push('Debe capturar el Email')
        }
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegexp.test(user.email)) {
            saveFlag = false;
            errorMessages.push('El email ' + user.email + ' no es valido.')
        }

        if (user.password.nick > 0 && user.email.length > 0) {
            // Se compara la consulta inicial para validar si no hay matches del nick y email capturados
            for (var u in users) {
                console.log(users[u]);
                if (users[u].nick == user.nick) { userCompFlag.nick = true }
                if (users[u].email == user.email) { userCompFlag.email = true }
            }
            if (userCompFlag.nick) {
                saveFlag = false;
                errorMessages.push('Ya existe un usuario con el nick: ' + user.nick)
            }
            if (userCompFlag.email) {
                saveFlag = false;
                errorMessages.push('Ya existe un usuario con el email: ' + user.email)
            }
        }

        // se genera el nuevo registro si no hubo un error en la informacion recibida
        if (saveFlag) {
            user.save((err, userStored) => {

                if (err) {
                    console.log(err)
                    return res.status(500).send({ message: `Error al salvar en la base de datos: ${err}` })
                }

                //return res.render('saveUserResponse.pug', { status: false, message: `Error al salvar en la base de datos: ${err}` });
                //return res.render('saveUserResponse.pug', { status: true, user: userStored });
                res.status(200).send({ status: true, user: userStored })
            })
        } else {
            res.status(200).send({ status: false, message: errorMessages })
        }
    })



}



function getUser(req, res) {
    //variables iniciales
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion: ${err}` })
        if (!user) return res.status(200).send({ status: false, message: `El usuario no existe` })
            //return res.status(200).send({ status: true, user: user })
        return res.render('getUser.pug', { status: true, user: user });
    })
}


function updateUser(req, res) {

    let userId = req.params.userId
    let set = { $set: { nick: req.body.nick, nombre: req.body.nombre, apellidos: req.body.apellidos, password: req.body.password, rol: req.body.rol, email: req.body.email } }
    console.log(userId)
    console.log(req.body)

    User.updateOne({ _id: userId }, set, { overwrite: true }, (err, result) => {
        if (err) return res.status(500).send({ status: false, message: `Error al actualizar al usuario: ${err}` })
        return res.status(200).send({ status: true, userId: userId })
    });


}

function deleteUser(req, res) {
    let userId = req.params.userId

    User.findById(userId, (err, user) => {
        if (err) return res.render('deleteUserResponse.pug', { status: false, message: `Error al borrar al usuario: ${err}` });
        //return res.status(500).send({ message: `Error al borrar el usuario: ${err}` })
        if (!user) return res.render('deleteUserResponse.pug', { status: false, message: `El usuario no puede borrarse por que no existe` });
        //return res.status(200).send({ status: false, message: `El usuario no puede borrarse por que no existe` })

        user.remove(err => {
            if (err)
                if (err) return res.status(500).send({ message: `Error al borrar al usuario: ${err}` })
                    //return res.render('deleteUserResponse.pug', { status: false, message: `Error al borrar al usuario: ${err}` });
                    //return res.render('deleteUserResponse.pug', { status: true, message: `El usuario ha sido eliminado` });
            return res.status(200).send({ status: true, message: `El usuario ha sido eliminado` })
        })

    })
}

function getRolesCount(req, res) {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send({ message: `Error al realizar la peticion: ${err}` })
        if (!users) return res.status(200).send({ status: false, message: `No existen usuarios` })
        let usersCount = { Admin: 0, Operador: 0, Administrativo: 0 }
        for (var u in users) {
            if (users[u].rol == 'Admin') { usersCount.Admin++ } else if (users[u].rol == 'Operador') { usersCount.Operador++ } else if (users[u].rol == 'Administrativo') { usersCount.Administrativo++ }
        }
        return res.status(200).send({ usersCount })
    })
}

module.exports = {
    getUsers,

    getAddUser,
    saveUser,

    getUser,
    updateUser,

    deleteUser,
    getRolesCount
}