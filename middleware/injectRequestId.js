const { v4: uuid } = require('uuid');

// Express middleware that generates a request ID and injects it into the request object
module.exports = function (req, _, next) {
  req.id = uuid();
  next();
};
