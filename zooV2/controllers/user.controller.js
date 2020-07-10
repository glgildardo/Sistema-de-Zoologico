'user strict'

var User = require("../models/user.model");
var bcrypt = require('bcrypt-nodejs'); // Encriptador de contraseñas
var jwt = require("../services/jwt");
var fs = require('fs');// Administracion de archivo del servidor
var path = require('path'); // Manejo de rutas del servidor

function saveUser(req,res){
    var user = new User();
    var params =  req.body;

    if(params.username && params.name && params.email && params.password ){
        User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, exist) =>{
            if(err){
                res.status(500).send({message: "Error del servidor"});
            }else if(exist){
                res.send({exist: "Usuario o correo ya utilizado"});
            }else{
                user.name = params.name;
                user.username = params.username;
                user.email = params.email;
                user.password = params.password;
                user.role = 'USER';

                bcrypt.hash(params.password,null, null, (err, passwordHash) =>{
                    if(err){
                        res.status(500).send({message: "Error al encriptar contraseña"});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.save((err, userSaved) =>{
                            if(err){
                                res.status(500).send({message: "Error del servidor"});
                            }else if(userSaved){
                                res.send({message:"Usuario Creado", user: userSaved});
                            }else{
                                res.status(404).send({message: "Usuario no guardado"});
                            }   
                        })
                    }else{
                        res.status(418).send({message: "Error inesperado"});
                    }
                });
            }
        })
    }else{
        res.send({message: "Ingrese todos los datos"});
    }
}

function login(req, res){
    var params = req.body;
    
    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, check)=>{
                if(err){
                    res.status(500).send({message: "Error del servidor"});
                }else if(check){
                    bcrypt.compare(params.password, check.password, (err, passwordOk) =>{
                        if(err){
                            res.send(404).send({message: 'Error al comparar'});
                        }else if(passwordOk){
                            if(params.gettoken = true){
                                res.send({token: jwt.createToken(check)});
                            }else{
                                res.send({message: "Bienvenido", user: check});
                            }
                        }else{
                            res.send({message: "Contraseña incorrecta"});
                        }
                    })
                }else{
                    res.send({message:""});
                }
            })
        }else{
            res.send({message: "Ingrese su cotraseña"});
        }
    }else{
        res.send({message: "Ingrese el correo y usuario "});
    }
}

function MiddleWare (req, res){
    res.send({message: 'Prueba de middleware'});
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message:"Error de permisos para esta ruta"});
    }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, user)=>{
            if(err){
                res.status(500).send({message: "Error general"});
            }else if(user){
                res.send({User:user})
            }else{  
                res.status(404).send({message: "No se ha podido actualizar"});
            }
        })
    }
}

function uploadImage(req,res){
    var userId = req.params.id;
    var fileName = 'No subido';

    if(userId != req.user.sub){    
        res.status(403).send({message: "Error de permisos para esta ruta"});
    }else{
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];

            var ext = fileName.split('\.');
            var fileExt = ext[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userupdate) =>{
                    if(err){
                        res.status(500).send({message:"Error General"});
                    }else if(userupdate){
                        res.send({user: userupdate});
                    }else{
                        res.status(418).send({message:"No se ha podido actualizar"});
                    }
                });
            }else{
                fs.unlink(filePath, (err)=>{
                    if(err){
                        res.status(418).send({message:"Extencion de archivo no admitido, archivo no eliminado"});
                    }else{
                        res.send({message: "Extension de archivo no admitida"});
                    }
                });
            }
        }else{
            res.status(404).send({message: "No ha subido una imagen"});
        }
    }
}

function getImage(req,res){
    var userId = req.params.id;
    var fileName = req.params.image;
    var pathFile =   './uploads/users/'+fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: "Imagen inexistente"});
        }
    });
}

function listUser(req,res){
        User.find({}, (err, users) =>{
            if(err){
                res.status(500).send({message:"Error General"});
            }else if(users){
                res.send({users: users})
            }else{
                res.status(200).send({message:"No hay usuarios"});
            }
        })
}

module.exports ={
    saveUser,
    login,
    MiddleWare,
    updateUser,
    uploadImage,
    getImage,
    listUser
}