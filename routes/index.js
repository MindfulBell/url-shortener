var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var myFunc = require('../db-connect.js')

//NEED TO ABSTRACT THE MONGO CONNECTION OUT OF THIS! ALSO A CALLBACK? (controller essentially)

// process.env.MONGODB_MLAB
var dburl = 'mongodb://USERNAME:PASSWORD@ds011321.mlab.com:11321/fcc-tb' || 'mongodb://localhost:27017/fcc-tb'

router.use(express.static(__dirname + '/../public'))

router.get('/', function(req, res){
	return res.sendFile('index.html');
})

router.get('/new/:url(*)', function(req, res){
	MongoClient.connect(dburl, function(err, db){
		if (err) {
			console.log('Unable to connect to mongoDB server. Error: ', err)
			res.send('Error connecting to database!')
		}
		else {
			console.log('Connection established to ' + dburl)
			myFunc(db, req.params.url.toString(), req, res);
		}
	})	
})

router.get('/:shortUrl', function(req, res){
	//find that short-url in the database and its associated location
	MongoClient.connect(dburl, function(err, db){
		if (err) {
			console.log('Unable to connect to mongoDB server. Error: ', err);
			res.send('Error connecting to database!');
		}
		else {
			console.log('Connection established to ' + dburl)

			var collection = db.collection('urls');
			var userUrl = parseInt(req.params.shortUrl);

			collection.find( {short_url: userUrl} ).toArray(function(err, arr){			
				if (err) {
					return console.log(err)
				}
				if (arr.length) {
					console.log('Redirecting to ' + arr[0].original_url)
					return res.redirect(arr[0].original_url)										
				}
				else {						
					console.log('Document not found')
					return res.send('Sorry, we could not find that url')			
				}	
				db.close();	
				//need to manage the urls passed and such				
			})
		}		
	})
	//go to the location if there is one
	//if not, error
})

module.exports = router;