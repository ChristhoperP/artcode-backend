'use strict'
const User = require('../models/user');
const mongoose = require('mongoose');

var controller = {
    createShare: async function (req, res) {
        let userId = req.user;
        let { idObject, type, nameObject, idOwner, owner, creation } = req.body;
        let idUserDest = req.params.idUserDest;
        console.log(req.body);

        let shared = {
            "_id": mongoose.Types.ObjectId(),
            "idObject": mongoose.Types.ObjectId(idObject),
            "type": type,
            "idOwner": mongoose.Types.ObjectId(userId),
            "owner": owner,
            "creation": creation
        }

        if(type=="project"){
            shared.nameProject = nameObject;
        }else{
            shared.nameSnippet = nameObject;
        }

        if (idUserDest && idObject && idOwner && type) {
            await User.findByIdAndUpdate(
                idUserDest,
                {
                    $addToSet: {
                        sharedWithMe: shared
                    }
                },
                { new: true },
                (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error al actualizar' });

                    if (!userUpdate) return res.status(404).send({ message: 'no esxiste el usuario para agregar el proyecto.' });

                    return res.status(200).send({ shared: shared });
                });

        } else {
            return res.status(500).send({ message: 'No se han enviado los parametros requeridos.' });
        };
    },
    deleteShared: async function (req, res) {
        let userId = req.user;
        let idShared = req.params.idShared;

        await User.updateOne({
            _id: userId,
            "sharedWithMe._id": mongoose.Types.ObjectId(idShared)
        },
            {
                $unset: {
                    "sharedWithMe.$": ""
                }
            }, (err, userRemoved) => {
                if (err) return res.status(500).send({ message: 'Error al eliminar proyecto.' });

                if (!userRemoved) return res.status(404).send({ message: 'no existe el usuario para eliminar.' });

                return res.status(200).send({ usuario: userRemoved });
            });
    },
    getProject: async function (req, res) {
        await User.find({
            _id: req.params.idUserOwner,
            "Projects._id": mongoose.Types.ObjectId(req.params.idProject)
        },
            { "Projects.$": true })
            .then(result => {
                return res.status(200).send(result[0].Projects[0]);
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    },
    getSnippet: async function (req, res) {
        await User.find({
            _id: req.params.idUserOwner,
            "Snippets._id": mongoose.Types.ObjectId(req.params.idSnippet)
        },
            { "Snippets.$": true })
            .then(result => {
                return res.status(200).send(result[0].Snippets[0]);
            })
            .catch(error => {
                return res.status(500).send("Ocurrió un error: " + error);
            });
    }
};

module.exports = controller;