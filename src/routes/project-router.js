'use strict'

const express = require('express');
const ProjectController = require('../controllers/project-controller');
const email = require('../middlewares/email');
const auth = require('../middlewares/auth')

const router = express.Router();

//Obtener projects
router.get('/projects', auth.isAuth, ProjectController.getProjects);

//Obtener project
router.get('/project/:idProject', auth.isAuth, ProjectController.getProject);

//Crear project
router.post('/createProject', auth.isAuth, ProjectController.createProject);

//Update project
router.put('/updateProject/:idProject', auth.isAuth, ProjectController.updateProject);

//Delete project
router.delete('/deleteProject/:idProject', auth.isAuth, ProjectController.deleteProject);

module.exports = router;