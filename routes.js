(function() {
	'use strict';
	
	var express = require('express');
	var Pegelstand = require('./lib/Pegelstand.js');
	var Error = require('./lib/Error.js');

	var route = express();
	var app = new Pegelstand();
	
	route.get('/impressum', function(req, res) {
		res.render('impressum', {title: 'About pegel.JETZT'});
	});
	
	route.get('/:location?', function(req, res) {
		var location = req.params.location || 'hamburg';
		app.get(location, function(err, data) {
			if (err) {
				throw new Error('Unknown Location', 404, {location: req.params.location});
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