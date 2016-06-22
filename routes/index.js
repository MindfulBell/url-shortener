var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://<dbuser>:<dbpassword>@ds011321.mlab.com:11321/fcc-tb' || 'mongodb://localhost:27017/fcc-tb'

router.get('/', function(req, res){
	res.send('Hello');
})

router.get('/new/:url?', function(req, res){
	// build a new collection if there isn't one yet
	// add this url to the collection and randomly give it a #
	MongoClient.connect(url, function(err, db){
		if (err) {
			console.log('Unable to connect to mongoDB server. Error: ', err)
		}
		else {
			console.log('Connection established to, ' + url)

			var collection = db.collection('urls')

			//make sure we get a unique number, so have to go through db to make sure its not in use
			var shortUrl = Math.floor(Math.random() * 1000)
			var unique = false;

			while (!unique) {
				collection.find({shortUrl: shortUrl}).toArray(function (err, res){
					if (err) {
						console.log(err)
					}
					else if (res.length){
						shortUrl = Math.floor(Math.random() * 1000);
					}
					else {
						unique = true;
					}
				})
			}
			var urlPair = { url: req.params.url.toString(), shortUrl: shortUrl };

			collection.insert(urlPair, function(err, result){
				if (err) {
					console.log(err);
				}
				else {
					console.log('Inserted new url/short url into urls collection: ' + result)
				}
			})
		}
		db.close();
	})
})

router.get('/:short-url?', function(req, res){
	//find that short-url in the database and its associated location
	//go to the location if there is one
	//if not, error
})

module.exports = router;