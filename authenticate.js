const jwt = require('jsonwebtoken');
const config = require('config');
const accounts = require('./accounts.json');

// Method that attempts to authenticate a user and delivers a JWT on success
module.exports = function (identifier, password) {
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (account.identifier == identifier) {
      if (account.password == password) {
        let payload = {};
        payload.user = identifier;
        const roles = config.get('roles');
        for (let j = 0; j < roles.length; j++) {
          const role = roles[j];
          payload[role] = account.roles.includes(role);
        }
        return jwt.sign(payload, config.get('secret'));
      } else {
        throw new Error('Authentication failed.');
      }
    }
  }
  throw new Error('Authentication failed.');
};
