'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanSchema = Schema({
    namePlan: {type: String, required:true},
    class: {type: String, required:true},
    precio: {type: String, required:true},
    projects: {type: String, required:true},
    snippets:{type: String, required:true},
    acumulable: {type: Boolean},
    activo: {type: Boolean},
    duracion: {type: String},
    comprados: {type: Array}
});

module.exports = mongoose.model('plans', PlanSchema);