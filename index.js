const express = require('express');
const cors = require('cors');
const config = require('config');
const bodyParser = require('body-parser');

// Load the auth module
const authenticate = require('./authenticate.js');
const authorize = require('./middleware/authorize.js');

// Configure Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var corsOrigin = config.get('cors-origin');
if (corsOrigin === '*') {
  app.use(cors());
} else {
  app.use(cors({ origin: corsOrigin }));
}

// Load custom middleware
const injectRequestId = require('./middleware/injectRequestId.js');
const setLogging = require('./middleware/setLogging.js');
app.use(injectRequestId);
app.use(setLogging);

// Authentication route
app.post(config.get('authenticationRoute'), function (req, res) {
  if (req.body.identifier && req.body.password) {
    req.log(`Attempting to authenticate user with ID '${req.body.identifier}'.`);
    let token = null;
    try {
      token = authenticate(req.body.identifier, req.body.password);
      req.log(`Authentication of user with ID '${req.body.identifier}' successful! Token: ${token}`);
      res.json({ message: 'Login successful!', token: token });
    } catch (error) {
      req.log(`Authentication of user with ID '${req.body.identifier}' failed.`);
      res.status(401).end();
    }
  } else {
    req.log('Authentication request failed because of missing login credentials.');
    res.status(400).json({ message: 'Request missing login credentials.' });
  }
});

// Authorization route
app.get(config.get('authorizationRoute'), authorize, function (req, res) {
  res.json({ message: 'Successfully authorized!' });
});

// Role-specific authorization routes
var routes = config.get('routes');
for (var i = 0; i < routes.length; i++) {
  var route = routes[i];
  app.get(route.path, authorize, function (req, res, next) {
    if (req.token[route.role] === true) {
      res.json({
        message: `Successfully authorized with role '${route.role}'!`,
      });
    } else {
      res.status(401).end();
    }
  });
}

// 404 - Route not found
app.use(function (req, res, next) {
  req.log(`Unknown route '${req.path}' requested.`);
  res.status(404).json({ message: `Route not found!` });
});

// Error handling
app.use(function (err, req, res, _) {
  req.log(err.stack);
  res.status(500).json({ message: err.message });
});

// Start listening for requests
app.listen(config.get('port'), () => console.log(`Mock auth server listening on port ${config.get('port')}...`));
