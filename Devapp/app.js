'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

app.use(express.static(__dirname + '/Public'));
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/Public/Views'});
});
// just comment
app.listen(5000);
