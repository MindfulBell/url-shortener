var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.get('/', function(req, res){
	res.send('Hello');
})

router.get('/new/:url', function(req, res){
	// build a new collection if there isn't one yet
	// add this url to the collection and randomly give it a #
})

router.get('/:short-url', function(req, res){
	//find that short-url in the database and its associated location
	//go to the location if there is one
	//if not, error
})

module.exports = router;