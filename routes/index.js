var express = require('express');

var HandleUrl = require('../controllers/handleUrl.js')

module.exports = function(app, db){
	
	var handleUrl = new HandleUrl(db);
	
	app.use(express.static(__dirname + '/../public')) // can i move this?

	app.get('/', function(req, res){
		return res.sendFile('index.html');
	})
	
	app.get('/new/:url(*)', function(req, res){
		//create a new short url for the users entry
		handleUrl.addurl(req.params.url.toString(), req, res);
	})
	
	app.get('/:shortUrl', function(req, res){
		//find that short-url (number) in the database and its associated location
		handleUrl.geturl(parseInt(req.params.shortUrl), req, res);
	})
}


