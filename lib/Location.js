(function() {
	'use strict';
	
	var Location = function() {
		
	};
	
	Location.prototype.prepareData = function(data) {
		return {
			label: this.label,
			geo: this.geo,
			river: this.river,
			title: this.title,
			name: this.name,
			data: data
		};
	};
	
	Location.prototype.fetch = function(callback) {
		this.getData(callback);
	};
	
	module.exports = exports = Location;
})();