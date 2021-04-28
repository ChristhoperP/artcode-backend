'use strict'
const User = require('../models/user');
const Plan = require('../models/plans')
const mongoose = require('mongoose');
const moment = require('moment');

var controller = {
    getPlans: async function (req, res) {
        await Plan.find({}, (err, plan) => {
            if (err) return res.status(500).send({ message: err });
            if (!plan || Object.entries(plan).length === 0) {
                //Registra planes
                Plan.insertMany([
                    {
                        "namePlan": "Plan Basic",
                        "class":"bg-secondary",
                        "precio": 0,
                        "projects": 2,
                        "snippets": 2,
                        "acumulable": false,
                        "activo": true,
                        "duracion": "ilimitado",
                        "comprados": []
                    },
                    {
                        "namePlan": "Plan Medium",
                        "class":"bg-success",
                        "precio": 9.99,
                        "projects": 8,
                        "snippets": 8,
                        "acumulable": true,
                        "activo": true,
                        "duracion": 30,
                        "comprados": []
                    },
                    {
                        "namePlan": "Plan Advanced",
                        "class":"bg-danger",
                        "precio": 19.99,
                        "projects": 15,
                        "snippets": 15,
                        "acumulable": true,
                        "activo": true,
                        "duracion": 60,
                        "comprados": []
                    }
                ]).then(result => {
                    return res.status(200).send(result);
                })
                    .catch(error => {
                        return res.status(500).send(error);
                    });
            } else {
                return res.status(200).send(plan);
            }

        });
    },
    buyPlan: async function (req, res) {
        //Registrar plan en el usuario
        if (req.user && req.body.idPlan && req.body.duration) {

            let duration = "";
            if (req.body.duration == "ilimitado") {
                duration = "ilimitado"
            }else{
                duration = moment().add(req.body.duration, 'days').format("DD-MMM-YYYY")
            }

            await User.findByIdAndUpdate(req.user,
                {
                    $push: {
                        myPlans: {
                            idPlan: mongoose.Types.ObjectId(req.body.idPlan),
                            start: moment().format("DD-MMM-YYYY"),
                            end: duration
                        }
                    }
                }, { new: true })
                .then(result => {
                    //Registrar compra en los planes
                    Plan.findByIdAndUpdate(req.body.idPlan, {
                        $push: {
                            comprados: {
                                idUser: req.user,
                                fechaCompra: moment().format("DD-MMM-YYYY")
                            }
                        }
                    })
                    .then(result2 => {
                        return res.status(200).send({message: "Se ha registrado la compra exitosamente.", error: false});
                    })
                    .catch(error => {
                        return res.status(500).send(error);
                    });
                })
                .catch(error => {
                    return res.status(500).send(error);
                });
        }else{
            return res.status(500).send({message: "Datos incompletos para registrar compra.", error: true});
        }
    }
};

module.exports = controller;