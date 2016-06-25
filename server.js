var express = require('express');
var app = express();
var routes = require('./routes/index.js');
var PORT = process.env.PORT || 8080;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;


var dburl = process.env.MONGODB_MLAB || 'mongodb://localhost:27017/fcc-tb'


MongoClient.connect(dburl, function(err, db){
	if (err) {
		console.log('Unable to connect to mongoDB server. Error: ', err)
	}
	else {
		console.log('Connection established to ' + dburl)
	}
	
	routes(app, db);
	
	app.listen(PORT, function(req, res){
        console.log('Listening on port ' + PORT);
    });
})

