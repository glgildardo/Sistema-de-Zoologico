'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_secreta_kinal_12345'

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(15, "days").unix 
    }
    return jwt.encode(payload,key);
}