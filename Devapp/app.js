'use strict';

// Main variables to setup && start server
var express         = require('express');
var app             = express();
var router          = express.Router();
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var path            = require('path');
var methodOverride  = require('method-override');

var api             = require('./Server/routes');

var morgan          = require('morgan');
var fs              = require('fs');

// ##Comm.: Logging used only in dev mode. To be wiped on production
// // Flags 'a' to append, 'w+' to rewrite
// // Logging all to 'applogs' and errors to 'errlogs'
var logStream = fs.createWriteStream(__dirname + '/../Devapp/Logs/applogs.log', {flags: 'w+'});
app.use(morgan('combined', {stream: logStream}));
var errStream = fs.createWriteStream(__dirname + '/../Devapp/Logs/errlogs.log', {flags: 'w+'});
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 },
    stream: errStream
  }));
// ##End comm.

// Server configuration
app.use(express.static(__dirname + '/Public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// DB configuration - simple, without log/pass

mongoose.connect('mongodb://localhost:27017/accedot');

// Start your engines :)
// // Process calls to API and send 'index' to all others, not related
app.use('/api', api);

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/Public/Views'});
});

// Start server
app.listen(5000);
console.log('App started on port 5000');
