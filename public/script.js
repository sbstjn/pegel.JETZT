$(document).ready(function() {
	var itm = $('#wave');
	var bar = $('#bar');
	
	var dur = 1200;
	var stp = 270;
	var siz = 500;
	
	var max = parseInt(itm.data('max'));
	var min = parseInt(itm.data('min'));
	var cur = parseInt(itm.data('cur'));
	
	max -= min;
	cur -= min;
	var pct = (cur/max) * 100;
	var tmp = parseInt(stp * (pct/100));
	
	itm.animate({
		'top': (-1 * siz + 80 + (270 - tmp)) + 'px'
	}, dur, 'linear', function() { });
	
	bar.animate({
		'top': (75 + (stp - tmp)) + 'px'
	}, dur, 'linear', function() { });
	
	$({pegel: $('#value').text()}).animate({pegel: itm.data('cur')}, {duration: dur, step: function(now) {
		$('#value').html(parseInt(now));
	}});
	
	$(document).bind('touchmove', function(e) {
		if ($(e.target).id != 'impressum') {
			e.preventDefault()
		}
	});
});