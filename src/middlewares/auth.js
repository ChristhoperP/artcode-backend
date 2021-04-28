'use strict'

const { response } = require('express');
const tokenService = require('../services/token');

function isAuth(req, res, next) {

    if (!req.headers.authorization) {
        return res.status(403).send({ verification: false, message: 'No tienes autorización: no se ha enviado la cabecera.' });
    };

    const token = req.headers.authorization.split(" ")[1];
    if (token == 'null' || token === undefined) {
        return res.status(401).send({ verification: false, message: 'No tienes autorización: token undefined.' });
    }

    tokenService.decodeToken(token)
        .then(response => {
            req.user = response;
            next();
        })
        .catch(response => {
            res.status(response.status).send({ verification: false, message: response.message });
        })
}

function noAuth(req, res, next) {
    if (!req.headers.authorization) {
        next()
    } else {
        const token = req.headers.authorization.split(" ")[1]
        if (token == 'null' || token === undefined) {
            next()
        } else {
            tokenService.decodeToken(token)
                .then(response => {
                    return res.status(403).send({ verification: false, message: 'No tienes autorización: ya has iniciado sesión.' })
                })
                .catch(response => {
                    next()
                })
        }
    }
}

module.exports = { isAuth, noAuth }
