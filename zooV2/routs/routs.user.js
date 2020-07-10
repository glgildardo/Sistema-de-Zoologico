'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var authentication = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty'); // Manejo de archivos 
var mdUpload = connectMultiparty({uploadDir: './uploads/users'});
var api = express.Router();

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);


/* Prueba de middleware*/
api.get('/pruebamiddleware', authentication.ensureAuth,userController.MiddleWare);
api.put('/updateUser/:id', authentication.ensureAuth, userController.updateUser);

api.put('/uploadImage/:id', [authentication.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImage/:id/:image', [authentication.ensureAuth,mdUpload], userController.getImage);

/*Listar usuarios (Admin)*/
api.get('/listarUsuarios', authentication.ensureAuthAdmin, userController.listUser);

    
module.exports = api;