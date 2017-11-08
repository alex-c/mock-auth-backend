const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');

const auth = require('./auth.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post(config.get('authRoute'), function(req, res, next) {
    try {
        var token = auth.authenticate(req.body.identifier, req.body.password);
        res.json({success: true, message: 'Login successful!', token: token});
    } catch (error) {
        next(error);
    }
});

app.get(config.get('protectedRoute'), auth.authorize, function(req, res) {
    res.json({success: true});
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({success: false, message: err.message});
});

app.listen(config.get('port'), () => console.log('Mock auth server listening on port ' + config.get('port') + '.'));
