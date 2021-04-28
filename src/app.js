'use strict'

var express = require("express");
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

// Cargar archivos de rutas
var user_routes = require('./routes/users-router');
var project_routes = require('./routes/project-router');
var snippet_routes = require('./routes/snippet-router');
var myUnit_routes = require('./routes/myUnit-router');
var plan_routes = require('./routes/plans-router');
var share_routes = require('./routes/share-router');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// CORS
app.use(cors());

// rutas
app.use('/api', user_routes);
app.use('/api', project_routes);
app.use('/api', snippet_routes);
app.use('/api', myUnit_routes);
app.use('/api', plan_routes);
app.use('/api', share_routes);

// exportar
module.exports = app;
