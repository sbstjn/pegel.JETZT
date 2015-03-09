(function() {
	var express = require('express');
	var Pegelstand = require('./lib/Pegelstand.js');

	var route = express();
	var app = new Pegelstand();
	
	route.get('/:location', function(req, res) {
		app.get(req.params.location, function(data) {
			console.log(data);
			res.send('Got location');
		});
	});
	
	route.get('/404', function(req, res) {
		res.statusCode = 404;
		res.send('Not Found');
	});
	
	route.get('/about', function(req, res) {
		res.render('about', {title: 'About pegel.JETZT'});
	});
	
	module.exports = exports = route;
})();