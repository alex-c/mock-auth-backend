const jwt = require('jsonwebtoken');
const config = require('config');
const accounts = require('./accounts.json');

// Debug output
function debug(message) {
  if (config.get('debugOutput')) {
    console.log(message);
  }
}

// Bundles the actual authentication/authorization logic
const AuthModule = {
  // Method that attempts to authenticate a user and deliver a JWT
  authenticate: function (identifier, password) {
    debug(`[Auth] Attempting to authenticate user ${identifier}...`);
    for (let i = 0; i < accounts.length; i++) {
      let account = accounts[i];
      if (account.identifier == identifier) {
        if (account.password == password) {
          let payload = {};
          payload.user = identifier;
          let roles = config.get('roles');
          for (let j = 0; j < roles.length; j++) {
            let role = roles[j];
            payload[role] = account.roles.includes(role);
          }
          debug(`[Auth] Authentication successfull. Payload: ${JSON.stringify(payload)}`);
          return jwt.sign(payload, config.get('secret'));
        } else {
          throw new Error('Authentication failed.');
        }
      }
    }
    throw new Error('Authentication failed.');
  },

  // Express middleware that authorizes a route using the JWT token supplied in the authorization header
  authorize: function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      let token = authHeader.substr(authHeader.indexOf(' ') + 1);
      debug(`[Auth] Attempting to authorize with token ${token}...`);
      jwt.verify(token, config.get('secret'), function (error, decoded) {
        if (error) {
          res.status(401).end();
        } else {
          req.token = decoded;
          debug(`[Auth] Authorization successful. Decoded token: ${JSON.stringify(decoded)}`);
          next();
        }
      });
    } else {
      res.status(401).end();
    }
  },
};

module.exports = AuthModule;
