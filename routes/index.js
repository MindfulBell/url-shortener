var express = require('express');
var router = express.Router();

var handleUrl = require('../handleUrl.js')

module.exports = function(db){
	router.use(express.static(__dirname + '/../public'))

	router.get('/', function(req, res){
		return res.sendFile('index.html');
	})

	router.get('/new/:url(*)', function(req, res){
		handleUrl(db).addurl(req.params.url.toString(), req, res);
	})

	router.get('/:shortUrl', function(req, res){
		//find that short-url in the database and its associated location
		handleUrl(db).geturl(parseInt(req.params.shortUrl, req, res));
	})
}

