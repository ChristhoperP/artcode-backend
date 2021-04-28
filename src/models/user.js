'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true, unique: true, lowercase:true},
    password:{type: String, required:true, select: false},
    profile: {type: String},
    Projects: Array,
    Snippets: Array,
    myUnit: Array,
    shared: Array,
    sharedWithMe: Array,
    myPlans: Array
});

module.exports = mongoose.model('usuarios', UserSchema);
