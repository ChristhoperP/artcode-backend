'use strict'

const User = require('../models/user');

async function isExist(req, res, next) {
    await User.find({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send({ message: `Error al verificar email: ${err}` });
        if (user[0]) return res.status(400).send({ message: 'El email ya está en uso.' });

        next();
    });
}
module.exports = { isExist }