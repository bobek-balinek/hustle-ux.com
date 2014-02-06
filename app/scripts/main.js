(function(){
	'use strict';

	/**
	 * Animation Shim
	 */
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame){
			window.requestAnimationFrame = function(callback) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame){
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	}());

	// Add jQuery .bindMany events
	$.fn.bindMany = function(events) {
		for (var key in events) {
			var match = key.match(/^(\S+)\s*(.*)$/);

			var name = match[1];
			var selector = match[2];
			var fn = events[key];

			$(this).on(name, selector, fn);
		}
	};

	/**
	 * Initialise FastClick
	 */
	window.addEventListener('load', function() {
		return FastClick && FastClick.attach(document.body);
	}, false);

	/**
	 * TODO: Refactor there into a main.js file
	 */
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle){

		var start = polarToCartesian(x, y, radius, endAngle);
		var end = polarToCartesian(x, y, radius, startAngle);
		var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

		var d = [
			'M', start.x, start.y,
			'A', radius, radius, 0, arcSweep, 0, end.x, end.y
		].join(' ');

		return d;
	}

	/**
	 * Click event when a user is holding a finger steady for longer than 2 seconds
	 */
	function initTip(callback){
		window.tt = true;
		var progress = 0;
		var dn = document.getElementById('arc1');

		var timer = setInterval(function(){
			if(progress <= 100){
				var angle = (progress * 3.6);
				dn.setAttribute('d', describeArc(32,32 , 28, 0, angle));
				progress += 1;
			}else{
				clearTimeout(timer);
				window.tt = false;
				progress = 0;
				callback();
			}
		},15);
	}

})(jQuery, Modernizr, FastClick, window);
