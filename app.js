var express = require('express');
var app = express();
var main = require('./routes/index.js');

app.use('/', main);

module.exports = app;