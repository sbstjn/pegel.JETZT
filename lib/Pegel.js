var fs = require('fs');
var cache = {};
var data = {};

var Pegel = function() {
	this.threshold = 5000;
};

/**
 * Check cache for location
 */
Pegel.prototype.checkCache = function(location, callback) {
	if (!cache[location.key]) {
		callback(false);
	} else {
		callback(Date.now() - cache[location.key] < 10000);
	}
};

/**
 * Load data from website
 */
Pegel.prototype.load = function(location, callback) {
	console.log('not cached');
	
	cache[location.key] = Date.now();
	callback({});
};

/**
 * Read data from cache
 */
Pegel.prototype.read = function(location, callback) {
	console.log('found cache');
	
	callback({});
};

/**
 * Get pegel data
 */
Pegel.prototype.get = function(location, callback) {
	var data = {};
	
	this.checkCache(location, function(found) {
		if (!found) {
			this.load(location, callback);
		} else {
			this.read(location, callback);
		}
	}.bind(this));
};

module.exports = new Pegel();