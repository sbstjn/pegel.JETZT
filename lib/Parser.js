(function() {
	'use strict';
	
	var Parser = function(location) {
		var LocationParser = require(__dirname + '/../locations/' + location + '.js');
		return new LocationParser();
	};
	
	module.exports = exports = Parser;
})();