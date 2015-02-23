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
				nw: null,
				bounds: {
					hw: null,
					nw: null
				}
			};
			
			var trs = $('table.box3 tbody tr');
			
			for (var i = 0; i < trs.length; i++) {
				var text = $(trs[i]).text();
				
				if (text.trim() != '') {
					var list = text.split("\n");
					
					if (list.length < 5) {
						continue;
					}
					
					var tmpDate = list[2].trim().split('.');
					var tmpTime = list[4].trim().split(':');
					var tmpVal = list[5].trim() * 100;
					var tmpType = list[3].trim();
					
					var curDate = new Date();
					curDate.setDate(tmpDate[0]);
					curDate.setMonth(parseInt(tmpDate[1])-1);
					curDate.setFullYear(tmpDate[2]);
					curDate.setHours(tmpTime[0]);
					curDate.setMinutes(tmpTime[1]);
					
					if (curDate > new Date()) {
						if (tmpType == 'HW' && !next.hw) {
							next.hw = curDate;
							next.bounds.hw = tmpVal + 10;
						}
						
						if (tmpType == 'NW' && !next.nw) {
							next.nw = curDate;
							next.bounds.nw = tmpVal - 10;
						}
						
						if (next.hw && next.nw) {
							if (next.hw < next.nw) {
								next.type = 'hw';
							} else {
								next.type = 'nw';
							}
							break;
						}
					}
				}
			}
			
			return callback(next);
		}
	});
	
	crawl.queue(this.location.sites.upcoming);

};

module.exports = new Parser();