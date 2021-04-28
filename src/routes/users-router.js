'use strict'

const express = require('express');
const UserController = require('../controllers/user-controller');
const email = require('../middlewares/email');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/home', UserController.home);
//Registrar Usuario
router.post('/signup', email.isExist, UserController.signUp);

//Obtener Usuario (login)
router.post('/signin', UserController.signIn);

//Obtener usuario
router.get('/getUser', auth.isAuth, UserController.getUser);

//Obtener Usuarios
router.get('/users', UserController.obtenerUsuarios);

//Establecer perfil

//Cambiar nombre y Contraseña
router.put('/updateUser', auth.isAuth, UserController.updateUser);

module.exports = router;