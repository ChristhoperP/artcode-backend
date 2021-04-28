'use strict'
const User = require('../models/user');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token');
const mongoose = require('mongoose')
const moment = require('moment');

var controller = {
    home: function (req, res) {
        return res.status(200).send({
            message: 'Hello world!'
        });
    },

    /*  */
    signUp: function (req, res) {
        var user = new User();
        let dateCreated = moment().format("DD-MMM-YYYY");
        let owner = req.body.name + " " + req.body.lastName;

        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = '';
        user.profile = '';
        user.Projects = [];
        user.Snippets = [];
        user.myUnit = [
            {
                "_id": mongoose.Types.ObjectId(),
                "nameFolder": "myUnit",
                "projects": [],
                "snippets": [],
                "folders": [],
                "owner": owner,
                "creation": dateCreated
            }
        ]
        user.shared = [];
        user.sharedWithMe = [];
        user.myPlans = [];

        bcrypt.hash(req.body.password, 10, async function (err, hash) {

            if (err) return res.status(500).send({ error: err });
            user.password = hash;

            await user.save((err, user) => {
                if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` });

                return res.status(200).send({ token: tokenService.createToken(user) });
            });
        });
    },
    signIn: async function (req, res) {
        if (!req.body.email || !req.body.password) return res.status(404).send({ message: "Ingrese usuario o contraseña." });

        await User.find({ email: req.body.email }, (err, user) => {
            if (err) return res.status(500).send({ message: err });
            if (!user || Object.entries(user).length === 0) return res.status(404).send({ message: "No existe el usuario." });

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) return res.status(500).send({ message: `Error al comparar contraseñas: ${err}` });
                if (!result) return res.status(404).send({ message: 'La contraseña es incorrecta.' });

                return res.status(200).send({
                    message: 'Te has logueado correctamente.',
                    token: tokenService.createToken(user[0]),
                })
            });

        }).select('+password');
    },
    getUser: async function (req, res) {
        await User.find({ _id: req.user }, (err, user) => {
            if (err) return res.status(500).send({ message: err });
            if (!user || Object.entries(user).length === 0) return res.status(404).send({ message: "No existe el usuario." });

            return res.status(200).send(user[0]);
        }).select(['-password']);
    },
    obtenerUsuarios: async function (req, res) {
        await User.find({}, { _id: true, name: true, lastName: true, profile: true })
            .then(result => {
                return res.status(200).send(result);
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    },
    updateUser: async function (req, res) {
        let userId = req.user;
        let { name, lastName, passwordOld, passwordNew } = req.body;
        let espera = false;

        //Actualiza nombre y apellido
        if (name && lastName) {
            espera = true;
            await User.findByIdAndUpdate(userId, {name, lastName}, {new: true}, (err, userUpdate)=>{
                if(err) return res.status(500).send({message: 'Error al actualizar'});
    
                if(!userUpdate) return res.status(404).send({message:'no existe el usuario para actualizar.'});
    
                return res.status(200).send({usuario: userUpdate});
            });
        };

        //Actualizar Contraseña
        if (passwordOld && passwordNew) {
            espera = true;
            await User.find({ _id: userId }, (err, user) => {
                if (err) return res.status(500).send({ message: err });
                if (!user || Object.entries(user).length === 0) return res.status(404).send({ message: "No existe el usuario." });
    
                bcrypt.compare(passwordOld, user[0].password, (err, result) => {
                    if (err) return res.status(500).send({ message: `Error al comparar contraseñas: ${err}` });
                    if (!result) return res.status(404).send({ message: 'La contraseña es incorrecta.' });

                    bcrypt.hash(passwordNew, 10, async function (err, hash) {
                        if (err) return res.status(500).send({ error: err });
                        //passwordNew = hash;
                        await User.findByIdAndUpdate(userId, {password: hash}, {new: true}, (err, userUpdate)=>{
                            if(err) return res.status(500).send({message: 'Error al actualizar'});
                
                            if(!userUpdate) return res.status(404).send({message:'no esxiste el usuario para actualizar.'});
                
                            return res.status(200).send({usuario: userUpdate});
                        });
                    });
                });
            }).select('+password');
        };

        if (!espera) {
            return res.status(403).send({message: "No se han enviado datos para actualizar."});
        }
    }
};

module.exports = controller;
