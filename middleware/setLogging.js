const config = require('config');
const debugOutput = config.get('debugOutput');

// Express middleware that injects a logger into the request object
module.exports = function (req, _, next) {
  if (debugOutput) {
    req.log = function (output) {
      console.log(`[${req.id}] ${output}`);
    };
  } else {
    req.log = function () {};
  }
  next();
};
