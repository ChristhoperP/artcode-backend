'use strict'
const User = require('../models/user');
const mongoose = require('mongoose');
const e = require('cors');
const moment = require('moment');

var controller = {
    getMyUnit: async function (req, res) {
        await User.find({ _id: req.user }, { myUnit: true })
            .then(result => {
                return res.status(200).send(result[0].myUnit);
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    },
    createMyUnit: async function (req, res) {
        let userId = req.user;
        let { url, type, idObject } = req.body;
        let dateCreated = moment().format("DD-MMM-YYYY");
        let owner = "";

        //Obtener myUnit del usuario y guardarlo en una variable

        await User.find({ _id: userId }, { myUnit: true, name:true, lastName:true })
            .then(result => {
                let myUnit = result[0].myUnit;
                owner = result[0].name + " " + result[0].lastName;

                //Validar la url
                let urlArray = url.split("/");
                console.log(urlArray);
                let nameObject = urlArray[urlArray.length-1];

                //Calcular los indices a recorrer

                let contaMyUnit = myUnit;
                let indices = [];
                let indiceId = 0;
                //Recorre todas las carpetas hasta encontrar la url
                for (let index = 0; index < urlArray.length-1; index++) {
                    const idCarpeta = urlArray[index];
                    
                    //Obtener el index del folder que tiene el id
                    for (let index2 = 0; index2 < contaMyUnit.length; index2++) {
                        const folder = contaMyUnit[index2];
                        
                        if(folder._id == idCarpeta){
                            indices.push(index2);
                            indiceId = index2;
                            break;
                        }
                    }
                    //console.log("conta: ", contaMyUnit);
                    contaMyUnit = contaMyUnit[indiceId].folders;            
                };

                console.log("indices a recorrer: ", indices);


                let ruta = "";
                for (let index = 0; index < indices.length; index++) {
                    const indexFolder = indices[index];
                    
                    if(index == 0){
                        ruta += "myUnit[0]";
                    }else{
                        ruta += `.folders[${indexFolder}]`;
                    }
                }

                console.log("ruta a ejecutar: ", ruta);

                switch (type) {
                    case "project":
                        ruta += `.projects.push({_id:idObject, nameProject:nameObject, owner: owner, creation: dateCreated})`; 
                        break;
                    case "snippet":
                        ruta += `.snippets.push({_id:idObject, nameSnippet:nameObject, owner: owner, creation: dateCreated})`;  
                        break;
                    case "folder":
                        var newFolder = {
                            "_id": mongoose.Types.ObjectId(),
                            "nameFolder": nameObject,
                            "owner": owner, 
                            "creation": dateCreated,
                            "projects": [],
                            "snippets": [],
                            "folders": []
                        }
                        ruta += ".folders.push(newFolder)";
                        break;
                }

                //Ejecutar la instruccion
                eval(ruta);

                //Actualizar la bbdd sustituyendo myUnit por la variable
                User.updateOne({ _id: userId }, { "myUnit": myUnit },
                    (err, result) => {
                        if (err) return res.status(500).send({ message: 'Error al actualizar mi unidad.' });

                        if (!result) return res.status(404).send({ message: 'no existe el usuario para actualizar mi unidad.' });

                        let newProject = {_id:idObject, nameProject:nameObject, owner: owner, creation: dateCreated};
                        let newSnippet = {_id:idObject, nameSnippet:nameObject, owner: owner, creation: dateCreated};

                        return res.status(200).send({ usuario: result, newFolder: newFolder, newProject: newProject , newSnippet: newSnippet});
                    }); 
            })
            .catch(error => {
                return res.status(500).send(error);
            });
    },
    updateMyUnit: async function (req, res) {
        return res.status(200).send({ message: "coming soon" });
    },
    deleteMyUnit: async function (req, res) {
        return res.status(200).send({ message: "coming soon" });
    }
};

module.exports = controller;