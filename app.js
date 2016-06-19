var express = require('express');
var app = express();

module.exports = app.get('/', require('./routes/index.js'));