'use strict'

var Animal = require('../models/animal.model');
var authentication = require('../middlewares/authenticated');
var fs = require('fs');
var path = require('path');

function saveAnimal(req,res){
    var params = req.body;
    var animal = new Animal();

    if(req.user.role == 'ADMIN'){
        if(params.name && params.nickname && params.age && params.carer){
            animal.name = params.name;
            animal.nickname = params.nickname;
            animal.age = params.age;
            animal.carer = params.carer;
    
            animal.save((err, animalsave) =>{
                if(err){
                    res.status(500).send({message: "Error general de servidor"});
                }else if(animalsave){
                    res.send({Animal: animalsave});
                }else{
                    res.status(400).send({err: "No se ha podido guardar"});
                }
            });
        }else{
            res.send({message:"Ingrese todos los parametros"});
        }
    }else{
        res.status(403).send({message: 'No tiene autorizacion para esa ruta'});
    }
}

function updateAnimal(req,res){
    var animalId = req.params.id;
    var update = req.body
    
    if(req.user.role == "ADMIN"){
        Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, updateAnimal) =>{
            if(err){
                res.status(500).send({message:"Error general"});
            }else if(updateAnimal){
                res.send({animal: update});
            }else{
                res.status(404).send({err: "No se ha encontrado usuario para actualizar"});
            }
        });
    }else{
        res.status(403).send({message: "No tienen permisos para esta ruta"});
    }
}

function deleteAnimal(req, res) {
    var animalId = req.params.id;

    if(req.user.role == "ADMIN"){
        Animal.findByIdAndRemove(animalId, (err, deleteuser) =>{
            if(err){
                res.status(500).send({message: "Error general"});
            }else if(deleteuser){
                res.send({message: "Usuario eliminado exitosamente"});
            }else{
                res.status(404).send({err: "No se encontro el usuario a eliminar"});
            }
        });    
    }else{
        res.status(403).send({message: "No tienen permisos para esta ruta"});
    }
}

function uploadImage(req, res){
    var animalId = req.params.id;
    var fileName = 'No subido';

    if(req.user.role == "ADMIN"){
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];
    
            var ext = fileName.split('\.');
            var fileExt = ext[1];
    
            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Animal.findByIdAndUpdate(animalId, {image: fileName}, (err, animalUpdate) =>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(animalUpdate){
                        res.send({animal: animalUpdate});
                    }else{
                        res.status({message: 'No existe el animal'});
                    }
                });
            }else{
                fs.unlink(filePath, (err) =>{
                    if(err){
                        res.status(500).send({err: "Error general del servidor"});
                    }else{
                        res.send({message: 'Formato no admitido'});
                    }
                });
            }
        }    
    }else{
        res.status(403).send({message: "No tienen permisos para esta ruta"});
    }

    
}

function getImageAnimal(req, res){
    var animalId = req.params.id;
    var fileName = req.params.image;
    var pathFile = './uploads/users' + fileName; 

    if(req.user.role == "ADMIN"){
        fs.exists(pathFile, (exists)=>{
            if(exists){
                res.sendFile(path.resolve(pathFile));
            }else{
                res.status(404).send({message: "Imagen inexistente o no encontrada"});
            }
        });
    }else{
        res.status(403).send({message: "No tienen permisos para esta ruta"});
    }
}

function listAnimals(req, res){
    
    Animal.find({}, (err, animals) =>{
        if(err){
            res.status(500).send({message: 'Error general del servidor'});
        }else if(animals){
            res.send({animal: animals});
        }else{
            res.status(404).send({message: 'No se a encontrado animales'});
        }
    }).populate('users');
}

function searchAnimal(req, res) {
    var animalId = req.params.id;

    Animal.findById(animalId, (err, animal) =>{
        if(err){
            res.status(500).send({message:'Error general del servidor'});
        }else if(animal){
            res.send({Animal: animal});
        }else{
            res.status(404).send({message: "No se ha encontrado el animal"});
        }
    })
}

module.exports = {
    saveAnimal,
    updateAnimal,
    deleteAnimal,
    uploadImage,
    getImageAnimal,
    listAnimals,
    searchAnimal
}