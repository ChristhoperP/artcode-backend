'use strict'

var produccion = true; //cambiar valor dependiendo el entorno

if (produccion) {
    module.exports = {
        port: process.env.PORT || 7001,
        db:'mongodb+srv://christhoper:honduras100@cluster0-bh6yp.mongodb.net/artcode?retryWrites=true&w=majority',
        SECRET_TOKEN: 'miclavedetokenxd'
    }
} else {
    module.exports = {
        port: process.env.PORT || 3700,
        db: process.env.MONGODB || 'mongodb://localhost:27017/artcode',
        SECRET_TOKEN: 'miclavedetokenxd'
    }
}