'use strict'

const express = require('express');
const myUnitController = require('../controllers/myUnit-controller');
const email = require('../middlewares/email');
const auth = require('../middlewares/auth')

const router = express.Router();

//Obtener todo
router.get('/myUnit', auth.isAuth, myUnitController.getMyUnit);

//Obtener Carpeta
//router.get('/myUnit/:idMyUnit', auth.isAuth, myUnitController.getMyUnit);

//Crear Carpeta
router.post('/createMyUnit', auth.isAuth, myUnitController.createMyUnit);

//Update Carpeta
router.put('/updateMyUnit/:urlFolder/:nombreCarpeta', auth.isAuth, myUnitController.updateMyUnit);

//Delete Carpeta
router.delete('/deleteMyUnit/:urlFolder/:nombreCarpeta', auth.isAuth, myUnitController.deleteMyUnit);

module.exports = router;