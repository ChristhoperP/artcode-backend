'use strict'
const User = require('../models/user');
const mongoose = require('mongoose')

var controller = {
    getSnippets: async function (req, res) {
        await User.find({ _id: req.user }, { Snippets: true })
            .then(result => {
                return res.status(200).send(result[0].Snippets.filter(Boolean));
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    },
    createSnippet: async function (req, res) {
        let userId = req.user;
        let { nameSnippet, content, url } = req.body;

        if (nameSnippet && url) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                        Snippets: {
                            _id: mongoose.Types.ObjectId(),
                            nameSnippet,
                            content,
                            url
                        }
                    }
                },
                { new: true },
                (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error al actualizar' });

                    if (!userUpdate) return res.status(404).send({ message: 'no esxiste el usuario para agregar el snippet.' });

                    return res.status(200).send({ snippet: userUpdate.Snippets[userUpdate.Snippets.length - 1] });
                });
        } else {
            return res.status(500).send({ message: 'No se han enviado los parametros requeridos.' });
        };
    },
    getSnippet: async function (req, res) {
        await User.find({
            _id: req.user,
            "Snippets._id": mongoose.Types.ObjectId(req.params.idSnippet)
        },
            { "Snippets.$": true })
            .then(result => {
                return res.status(200).send(result[0].Snippets[0]);
            })
            .catch(error => {
                return res.status(500).send("Ocurrió un error: " + error);
            });
    },
    updateSnippet: async function (req, res) {
        let userId = req.user;
        let { nameSnippet, content, url } = req.body;
        let espera = false;

        //Actualiza snippet
        if (nameSnippet && url) {
            espera = true;
            await User.updateOne(
                {
                    _id: userId,
                    "Snippets._id": mongoose.Types.ObjectId(req.params.idSnippet)
                },
                {
                    "Snippets.$": {
                        "_id": mongoose.Types.ObjectId(req.params.idSnippet),
                        "nameSnippet": nameSnippet,
                        "content": content,
                        "url": url
                    }
                },
                { new: true }, (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error al actualizar' });

                    if (!userUpdate) return res.status(404).send({ message: 'no existe el usuario para actualizar.' });

                    return res.status(200).send({ usuario: userUpdate });
                });
        };

        if (!espera) {
            return res.status(403).send({ message: "No se han enviado datos para actualizar." });
        }
    },
    deleteSnippet: async function (req, res) {
        let userId = req.user;
        let SnippetId = req.params.idSnippet;

        await User.updateOne({
            _id: userId,
            "Snippets._id": mongoose.Types.ObjectId(req.params.idSnippet)
        },
            {
                $unset: {
                    "Snippets.$": ""
                }
            }, (err, userRemoved) => {
                if (err) return res.status(500).send({ message: 'Error al eliminar snippet.' });

                if (!userRemoved) return res.status(404).send({ message: 'no existe el usuario para eliminar.' });

                return res.status(200).send({ usuario: userRemoved });
            });
    }
};

module.exports = controller;