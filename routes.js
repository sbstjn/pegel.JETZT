(function() {
	'use strict';
	
	var express = require('express');
	var Pegelstand = require('./lib/Pegelstand.js');

	var route = express();
	var app = new Pegelstand();
	
	route.get('/404', function(req, res) {
		res.statusCode = 404;
		res.send('Not Found');
	});
	
	route.get('/impressum', function(req, res) {
		res.render('impressum', {title: 'About pegel.JETZT'});
	});
	
	route.get('/:location', function(req, res) {
		app.get(req.params.location, function(err, data) {
			if (err) {
				res.redirect('/404');
			} else {
				data.location = true;
				/* jshint camelcase: false */
				data.format_time = function(h, m) {
					return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
				};
				
				res.render('location', data);
			}
		});
	});
	
	module.exports = exports = route;
})();