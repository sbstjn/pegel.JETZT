(function() {
  'use strict';
  
  var Parser = require(__dirname + '/Parser.js');
  var fs = require('fs');
  var conf = JSON.parse(fs.readFileSync(__dirname + '/../config/data.json'));
  
  var App = function() {
    this.cache = {};
    this.data = {};
    this.threshold = 10000;
  };
  
  /**
   * Check if location is known
   */
  App.prototype.isKnown = function(location, callback) {
    callback(conf.available.indexOf(location) > -1);
  };
  
  App.prototype.get = function(location, callback) {
    this.isKnown(location, function(found) {
      if (!found) {
        callback('Not Found');
      } else {
        this.getLocation(location, callback);
      }
    }.bind(this));
  };
  
  /**
   * Get Location
   */
  App.prototype.getLocation = function(location, callback) {
    this.checkCache(location, function(found) {
      if (!found) {
        this.getFromWebsite(location, callback);
      } else {
        this.getFromCache(location, callback);
      }
    }.bind(this));
  };
  
  /**
   * Check cache for location
   */
  App.prototype.checkCache = function(location, callback) {
    callback(this.cache[location] && Date.now() - this.cache[location] < this.threshold);
  };
  
  /**
   * Load data from website
   */
  App.prototype.getFromWebsite = function(location, callback) {
    this.cache[location] = Date.now();
    
    var current = new Parser(location);
    current.fetch(function(err, stand) {
      this.data[location] = stand;
  
      callback(err, stand);
    }.bind(this));
  };
  
  /**
   * Read data from cache
   */
  App.prototype.getFromCache = function(location, callback) {
    if (this.data[location]) {
      this.data[location].cached = true;
      callback(null, this.data[location]);
    } else {
      this.load(location, callback);
    }
  };
  
  module.exports = exports = App;
})();