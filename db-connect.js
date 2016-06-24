module.exports = function(db, userInput, req, res){

	var collection = db.collection('urls')
	
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
				db.close();
			});

			return res.json({
				original_url: userUrl, 
				short_url: 'https://' + req.hostname + '/' + shortUrl
			});
		}
	});
}