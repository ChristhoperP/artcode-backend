'use strict'

const express = require('express');
const ShareController = require('../controllers/share-controller');
const auth = require('../middlewares/auth');

const router = express.Router();

//Crear shared
router.post('/createShared/:idUserDest', auth.isAuth, ShareController.createShare);

//Delet usuario
router.delete('/deleteShared/:idShared', auth.isAuth, ShareController.deleteShared);

//Obtener Project de otro usuario
router.get('/getShared/:idUserOwner/projects/:idProject', auth.isAuth, ShareController.getProject);

//Obtener Snippet de otro usuario
router.get('/getShared/:idUserOwner/snippets/:idSnippet', auth.isAuth, ShareController.getSnippet);

module.exports = router;