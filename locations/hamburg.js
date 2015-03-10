(function() {
	'use strict';
	
	// Load Crawler
	var Crawler = require('crawler');
	
	// Load Node.js util library
	var util = require('util');
	
	// Add trim to String
	if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			/* jshint -W121 */
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
	};
	
	// Load Location object
	var BaseLocation = require(__dirname + '/../lib/Location.js');
	
	// Define custom location
	var Location = function() {
		this.label 	= 'Hamburg';
		this.geo 		= ['53°32\'44"', '9°58\'12"'];
		this.river 	= 'Elbe';
		this.title 	= 'Aktueller Pegelstand der Elbe in Hamburg, St. Pauli';
		this.name 		= 'Hamburg';
		this.sites 	= {
			'current': 'http://www.pegelonline.wsv.de/gast/stammdaten?pegelnr=5952050',
			'upcoming': 'http://www.bsh.de/cgi-bin/gezeiten/was_tab.pl?ort=DE__508P&zone=Gesetzliche+Zeit+%B9&niveau=PN'
		};
	};
	
	// Inherit functions from Location
	util.inherits(Location, BaseLocation);
	
	Location.prototype.getData = function(callback) {
		var calls = 0;
		var pegelstand = {
			value: null,
			next: null,
			date: null
		};
		
		// Check response
		var check = function() {
			calls++;
			
			if (calls === 2) {
				callback(null, this.prepareData(pegelstand));
			}
		}.bind(this);
		
		// Parse current
		this.current(function(data) {
			pegelstand.value = data.value;
			pegelstand.date = data.date;
			
			check();
		}.bind(this));
		
		// Parse upcoming
		this.upcoming(function(data) {
			pegelstand.next = data;
			
			check();
		}.bind(this));
	};
	
	Location.prototype.current = function(callback) {
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
		
		crawl.queue(this.sites.current);
	};
	
	Location.prototype.upcoming = function(callback) {
		var crawl = new Crawler({
			maxConnections : 1,
			callback : function (error, result, $) {
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
	
					if (text.trim() !== '') {
						var list = text.split('\n');
	
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
							if (tmpType === 'HW' && !next.hw) {
								next.hw = curDate;
								next.bounds.hw = tmpVal + 10;
							}
	
							if (tmpType === 'NW' && !next.nw) {
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
	
		crawl.queue(this.sites.upcoming);
	};

	
	module.exports = exports = Location;
})();