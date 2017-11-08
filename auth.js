const jwt = require('jsonwebtoken');
const config = require('config');
const accounts = require('./accounts.json');

//Bundles the actual authentication/authorization logic
var AuthModule = {

    //Method that attempts to authenticate a user and deliver a JWT
    authenticate: function(identifier, password) {
        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];
            if (account.identifier == identifier) {
                if (account.password == password) {
                    var payload = {};
                    payload.user = identifier;
                    var roles = config.get('roles');
                    for (var j = 0; j < roles.length; j++) {
                        var role = roles[j];
                        payload[role] = account.roles.includes(role);
                    }
                    console.log(payload);
                    return jwt.sign(payload, config.get('secret'));
                } else {
                    throw new Error("Authentication failed.");
                }
            }
        }
        throw new Error("Authentication failed.");
    },

    //Express middleware that authorizes a route using the JWT token supplied in the authorization header
    authorize: function(req, res, next) {
        var authHeader= req.headers['authorization']
        if (authHeader) {
            var token = authHeader.substr(authHeader.indexOf(" ") + 1);
            jwt.verify(token, config.get('secret'), function(error, decoded) {
                if (error) {
                    next(new Error("Authorization failed."));
                }
                req.token = decoded;
                next();
            });
        } else {
            next(new Error("Authorization failed."));
        }
    }
}

module.exports = AuthModule;
