var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

//NEED TO ABSTRACT THE MONGO CONNECTION OUT OF THIS! ALSO A CALLBACK? (controller essentially)

var dburl = 'mongodb://USERNAME:PASS@ds011321.mlab.com:11321/fcc-tb' || 'mongodb://localhost:27017/fcc-tb'

router.get('/', function(req, res){
	res.send('Hello');
})

router.get('/new/:url?', function(req, res){
	// build a new collection if there isn't one yet
	// add this url to the collection and randomly give it a #
	MongoClient.connect(dburl, function(err, db){
		if (err) {
			console.log('Unable to connect to mongoDB server. Error: ', err)
		}
		else {
			console.log('Connection established to ' + dburl)

			var collection = db.collection('urls')
			
			//get array of shortUrls in use already
			var shortUrl = Math.floor(Math.random() * (9999-1000) + 1000);
			var userUrl = req.params.url.toString();
			
			//check if shortUrl is already in use
			collection.find({}, {_id: 0, url: 0}).toArray(function(err, arr){
				var urls = arr.map(function(url){
					return url.shortUrl;
				})
				
				if (err) {
					console.log(err)
				}
				
				//get new unique shortUrl if necessary
				while (urls.indexOf(shortUrl) !== -1) {
					shortUrl = Math.floor(Math.random() * (9999-1000) + 1000);
				}
				
				//insert url pair to db
				var urlPair = { url: userUrl, shortUrl: shortUrl };
				collection.insert(urlPair, function(err, result){
					if (err) {
						console.log(err);
						res.send('document failed to add');
					}
					else {
						console.log('Inserted new url/short url into urls collection')
						res.send('document added!');
					}
					db.close();
				});
			});
		}
	})
	
})

router.get('/:shortUrl?', function(req, res){
	//find that short-url in the database and its associated location
	MongoClient.connect(dburl, function(err, db){
		if (err) {
			console.log('Unable to connect to mongoDB server. Error: ', err)
		}
		else {
			console.log('Connection established to ' + dburl)
		}
		
		var collection = db.collection('urls');
		var userUrl = parseInt(req.params.shortUrl);
		
		collection.find( {shortUrl: userUrl} ).limit(1).toArray(function(err, arr){
			console.log(arr[0].url)
			if (err) {
				return console.log(err)
			}
			else if (arr.length === 0) {
				console.log('Document not found')
				return res.send('Sorry, we could not find that url')
			}
			db.close();
			res.redirect(arr[0].url)
			//need to manage the urls passed and such
		})
		
	})
	//go to the location if there is one
	//if not, error
})

module.exports = router;