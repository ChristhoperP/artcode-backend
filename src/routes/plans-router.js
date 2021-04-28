'use strict'

const express = require('express');
const PlanController = require('../controllers/plan-controller');
const auth = require('../middlewares/auth');

const router = express.Router();

//Obtener planes
router.get('/plans/', PlanController.getPlans);

//Registrar plan usuario
router.post('/plans/', auth.isAuth, PlanController.buyPlan);

module.exports = router;