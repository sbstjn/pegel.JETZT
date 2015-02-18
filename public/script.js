$(document).ready(function() {
	var itm = $('#cur');
	
	var max = parseInt(itm.data('max'));
	var min = parseInt(itm.data('min'));
	var cur = parseInt(itm.data('cur'));
	
	max -= min;
	cur -= min;
	var pct = (cur/max) * 100;
	
	itm.animate({
			'top': (100 - pct) + '%'
		}, 2000);
});