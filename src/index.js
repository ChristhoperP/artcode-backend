'use strict'

var mongoose = require('mongoose');
var app = require('./app');
const port = 3700;
const servidor = 'localhost:27017';
const db = 'artcode';
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Conexión a la base de datos con éxito.");

        //creacion del servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo correctamente en la url: localhost:${port}`);
        });

    })
    .catch(err => console.log(err));
