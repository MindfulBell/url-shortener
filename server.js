var app = require('./app.js');
var PORT = process.env.PORT || 8080;

app.listen(PORT, function(req, res){
	console.log('Listening on port ' + PORT);
})