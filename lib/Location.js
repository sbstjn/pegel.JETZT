(function() {
	var Location = function() {
		
	};
	
	Location.prototype.getLabel = function() {
		return this.label;
	};
	
	Location.prototype.fetch = function(callback) {
		callback({
			label: this.getLabel(),
			date: new Date()
		});
	};
	
	module.exports = exports = Location;
})();