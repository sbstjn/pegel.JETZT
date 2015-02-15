var fs = require('fs');
var Crawler = require("crawler");
var Parser = require(__dirname + '/Parser.js');

var Pegel = function() {
	this.cache = {};
	this.data = {};
	this.threshold = 5000;
};

/**
 * Check cache for location
 */
Pegel.prototype.checkCache = function(location, callback) {
	if (!this.cache[location.key]) {
		callback(false);
	} else {
		callback(Date.now() - this.cache[location.key] < this.threshold);
	}
};

/**
 * Load data from website
 */
Pegel.prototype.load = function(location, callback) {
	this.cache[location.key] = Date.now();
	
	Parser.fetch(location, function(stand) {
		this.data[location.key] = stand;
		
		callback(stand)
	}.bind(this));
};

/**
 * Read data from cache
 */
Pegel.prototype.read = function(location, callback) {
	if (this.data[location.key]) {
		callback(this.data[location.key]);
	} else {
		this.load(location, callback);
	}
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