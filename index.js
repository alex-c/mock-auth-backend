const express = require('express');
const cors = require('cors');
const config = require('config');
const bodyParser = require('body-parser');

//Load the auth module
const auth = require('./auth.js');

//Configure Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var corsOrigin = config.get('cors-origin');
if (corsOrigin == "*") {
    app.use(cors());
} else {
    app.use(cors({origin: corsOrigin}));
}

//Authentication route
app.post(config.get('authenticationRoute'), function(req, res, next) {
    try {
        let token = null;
        try {
            token = auth.authenticate(req.body.identifier, req.body.password);
        } catch (error) {
            res.status(401).end();
        }
        res.json({message: 'Login successful!', token: token});
    } catch (error) {
        next(error);
    }
});

//Authorization route
app.get(config.get('authorizationRoute'), auth.authorize, function(req, res) {
    res.json({message: 'Successfully authorized!'});
});

//Role-specific authorization routes
var routes = config.get('routes');
for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    app.get(route.path, auth.authorize, function(req, res, next) {
        if (req.token[route.role] === true) {
            res.json({message: `Successfully authorized with role '${route.role}'!`});
        } else {
            res.status(401).end();
        }
    });
}

//Error handling
app.use(function (err, req, res, next) {
    if (config.get('debugOutput')) {
        console.error(err.stack);
    }
    res.status(500).send({message: err.message});
});

//Start listening for requests
app.listen(config.get('port'), () => console.log(' +-----\n | Mock auth server listening on port ' + config.get('port') + '...\n +-----'));
