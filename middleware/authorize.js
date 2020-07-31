const jwt = require('jsonwebtoken');
const config = require('config');

// Express middleware that authorizes a route using the JWT token supplied in the authorization header
module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    let token = authHeader.substr(authHeader.indexOf(' ') + 1);
    req.log(`Attempting to authorize with token ${token}...`);
    jwt.verify(token, config.get('secret'), function (error, decoded) {
      if (error) {
        res.status(401).end();
      } else {
        req.token = decoded;
        req.log(`Authorization successful. Decoded token: ${JSON.stringify(decoded)}`);
        next();
      }
    });
  } else {
    res.status(401).end();
  }
};
