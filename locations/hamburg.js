(function() {
	// Load Node.js util library
	var util = require('util');
	
	// Load Location object
	var BaseLocation = require(__dirname + '/../lib/Location.js');
	
	// Define custom location
	var Location = function() {
		this.label = 'Hamburg';
	};
	
	// Inherit functions from Location
	util.inherits(Location, BaseLocation);
	
	module.exports = exports = Location;
})();