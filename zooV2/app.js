// Configura el servidor de express
'use Strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express(); // Va toda la configuracion de express
var userRoutes = require("./routs/routs.user");
var animalRoutes = require('./routs/routs.animal');

app.use(bodyParser.urlencoded({extended: false})); // Nos sirve para que no nos codifique la direccion http
app.use(bodyParser.json()); //Indicamos que utilizaremos json

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(userRoutes);
app.use(animalRoutes);

module.exports = app;