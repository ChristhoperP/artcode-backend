'use strict'
const User = require('../models/user');
const mongoose = require('mongoose')

var controller = {
    getProjects: async function (req, res) {
        await User.find({ _id: req.user }, { Projects: true })
            .then(result => {
                return res.status(200).send(result[0].Projects.filter(Boolean));
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    },
    createProject: async function (req, res) {
        let userId = req.user;
        let { nameProject, html, css, js, url } = req.body;
        console.log(req.body);

        if (nameProject && url) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                        Projects: {
                            _id: mongoose.Types.ObjectId(),
                            nameProject,
                            html,
                            css,
                            js,
                            url
                        }
                    }
                },
                { new: true },
                (err, userUpdate) => {
                    if (err) return res.status(500).send({ message: 'Error al actualizar' });

                    if (!userUpdate) return res.status(404).send({ message: 'no esxiste el usuario para agregar el proyecto.' });

                    return res.status(200).send({ project: userUpdate.Projects[userUpdate.Projects.length - 1] });
                });
        } else {
            return res.status(500).send({ message: 'No se han enviado los parametros requeridos.' });
        };
    },
    getProject: async function (req, res) {
        await User.find({
            _id: req.user,
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
    updateProject: async function (req, res) {
        let userId = req.user;
        let { nameProject, html, css, js, url } = req.body;
        let espera = false;

        //Actualiza proyecto
        if (nameProject && url) {
            espera = true;
            await User.updateOne(
                {
                    _id: userId,
                    "Projects._id": mongoose.Types.ObjectId(req.params.idProject)
                },
                {
                    "Projects.$": {
                        "_id": mongoose.Types.ObjectId(req.params.idProject),
                        "nameProject": nameProject,
                        "html": html,
                        "css": css,
                        "js": js,
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
    deleteProject: async function (req, res) { 
        let userId = req.user;
        let projectId = req.params.idProject;

        await User.updateOne({
            _id: userId,
            "Projects._id": mongoose.Types.ObjectId(req.params.idProject)
        },
        {
            $unset:{
                "Projects.$":""
            }
        }, (err, userRemoved) => {
            if (err) return res.status(500).send({ message: 'Error al eliminar proyecto.' });

            if (!userRemoved) return res.status(404).send({ message: 'no existe el usuario para eliminar.' });

            return res.status(200).send({ usuario: userRemoved });
        });
    }
};

module.exports = controller;