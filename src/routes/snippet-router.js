'use strict'

const express = require('express');
const SnippetController = require('../controllers/snippet-controller');
const email = require('../middlewares/email');
const auth = require('../middlewares/auth')

const router = express.Router();

//Obtener Snippets
router.get('/snippets', auth.isAuth, SnippetController.getSnippets);

//Obtener Snippet
router.get('/snippet/:idSnippet', auth.isAuth, SnippetController.getSnippet);

//Crear Snippet
router.post('/createSnippet', auth.isAuth, SnippetController.createSnippet);

//Update Snippet
router.put('/updateSnippet/:idSnippet', auth.isAuth, SnippetController.updateSnippet);

//Delete Snippet
router.delete('/deleteSnippet/:idSnippet', auth.isAuth, SnippetController.deleteSnippet);

module.exports = router;