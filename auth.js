const jwt = require('jsonwebtoken');
const config = require('config');
const accounts = require('./accounts.json');

var AuthModule = {
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
