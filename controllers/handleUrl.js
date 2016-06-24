function HandleUrl (db){
	var collection = db.collection('urls')
	
	this.addurl = function(userInput, req, res){
	
		var shortUrl = Math.floor(Math.random() * (9999-1000) + 1000);
		var userUrl = userInput.slice(0,4).toLowerCase() !== 'http' ? 
		userInput.replace(/.+/, 'http://$&') : userInput;
	
		//check if shortUrl is already in use
		collection.find({}).toArray(function(err, docs){
			if (err) {
				return console.log(err)
			}
			else {
				var urls = docs.map(function(url){
					return url.shortUrl;
				})				
				
				//get new unique shortUrl if necessary
				while (urls.indexOf(shortUrl) !== -1) {
					shortUrl = Math.floor(Math.random() * (9999-1000) + 1000);
				}
				
				//insert url pair to db
				var urlPair = { 
					original_url: userUrl, 
					short_url: shortUrl 
				};
	
				collection.insert(urlPair, function(err, result){
					if (err) {
						console.log(err);
						return res.send('document failed to add');
					}
					else {
						console.log('Inserted new url/short url into urls collection')
					}

				});
	
				return res.json({
					original_url: userUrl, 
					short_url: 'https://' + req.hostname + '/' + shortUrl
				});
			}
		});
	}
	this.geturl = function(userInput, req, res){
		
		//get the url associated with the shortUrl param and redirect to that site
		collection.find( {short_url: userInput} ).toArray(function(err, arr){			
			if (err) {
				return console.log(err)
			}
			if (arr.length) {
				console.log('Redirecting to ' + arr[0].original_url + '. Closing database.')
				db.close();
				res.redirect(arr[0].original_url);
				process.exit();
			}
			else if (!arr.length) {						
				console.log('Document not found');
				return res.send('Sorry, we could not find that url')			
			}
		})
	}
}

module.exports = HandleUrl;