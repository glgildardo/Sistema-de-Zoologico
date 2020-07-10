'use strict'

var express = require('express');
var api = express.Router();
var animalController = require('../controllers/animal.controller');
var authenticated = require('../middlewares/authenticated');
var connectMultiparty = require('connect-multiparty');
var mpUpload = connectMultiparty({uploadDir: './uploads/users'});


api.post('/saveAnimal', authenticated.ensureAuthAdmin, animalController.saveAnimal);
api.put('/updateAnimal/:id', authenticated.ensureAuthAdmin, animalController.updateAnimal);
api.delete('/deleteAnimal/:id', authenticated.ensureAuthAdmin, animalController.deleteAnimal);
api.get('/listAnimals', animalController.listAnimals);
api.get('/searchAnimal/:id', animalController.searchAnimal);

/* Subir y mostar imagenes de animales */
api.put('/uploadImage', [authenticated.ensureAuthAdmin,mpUpload], animalController.uploadImage);
api.get('/getImage/:id/:image', [authenticated.ensureAuthAdmin, mpUpload], animalController.getImageAnimal);
module.exports = api;