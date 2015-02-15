var Crawler = require("crawler");

if (!String.prototype.trim) {
	(function() {
		// Make sure we trim BOM and NBSP
		var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
		String.prototype.trim = function() {
			return this.replace(rtrim, '');
		};
	})();
}

var parseDateForCurrent = function(str) {
	var tmp = str.split(' ');

	var date = tmp[0].split('.');
	var time = tmp[1].split(':');

	var item = new Date();
	item.setDate(date[0]);
	item.setMonth(date[1] - 1);
	item.setFullYear(date[2]);
	item.setHours(time[0]);
	item.setMinutes(time[1]);
	item.setSeconds(0);

	return item;
}

var Parser = function() {

};

Parser.prototype.fetch = function(location, callback) {
	this.location = location;
	
	var calls = 0;
	var stand = {
		value: null,
		next: null,
		scale: null,
		date: null
	};
	
	// Check response
	var check = function() {
		if (calls == 2) {
			callback(stand);
		}
	};
	
	// Parse current
	this.current(function(data) {
		stand.value = data.value;
		stand.date = data.date;
		stand.scale = this.location.scale;
		
		calls++;
		check();
	}.bind(this));
	
	// Parse upcoming
	this.upcoming(function(data) {
		stand.next = data;
		
		calls++;
		check();
	}.bind(this));
}

Parser.prototype.current = function(callback) {
	var crawl = new Crawler({
		maxConnections : 1,
		callback : function (error, result, $) {
			var stand = {
				value: null,
				date: null
			};
			
			$('table[summary="Messwertgeber am Pegel"] tr:last-child td').each(function(index, el) {
				switch (index) {
					case 1:
						stand.value = parseInt(el.children.pop().data, 10);
						break;
					case 2:
						stand.date = parseDateForCurrent(el.children.pop().data.replace(' Uhr', ':00'));
						
						callback(stand);
						break;
				}
			});
		}
	});
	crawl.queue(this.location.sites.current);
};

Parser.prototype.upcoming = function(callback) {
	var crawl = new Crawler({
		maxConnections : 1,
		callback : function (error, result, $) {
			var done = false;
			var next = {
				hw: null,
				nw: null	
			};
			
			$($('.box100').last()).find('.box25a, .box25b').each(function(index, el) {
				var tmp = $(el).text().split("\n");
				var type = tmp.shift().trim();
				var date = tmp.shift().substr(0, 12);
				
				var tmp = new Date();
				tmp.setDate(parseInt(date.substr(0, 2)));
				tmp.setMonth(parseInt(date.substr(3, 2)) - 1);
				tmp.setHours(parseInt(date.substr(7, 2)));
				tmp.setMinutes(parseInt(date.substr(10, 2)));
				tmp.setSeconds(0);
				
				if (Date.now() < tmp && (!next.nw || !next.hw)) {
					if (!next.nw && type == 'NW') {
						next.nw = tmp;
					}
					
					if (!next.hw && type == 'HW') {
						next.hw = tmp;
					}
				}
				
				if (next.nw && next.hw && !done) {
					done = true;
					
					next.type = next.hw < next.nw ? 'hw' : 'nw';
					
					return callback(next);
				}
			});
		}
	});
	
	crawl.queue(this.location.sites.upcoming);

};

module.exports = new Parser();