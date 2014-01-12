(function(){

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
    FastClick.attach(document.body);
	}, false);

})(jQuery, Modernizr, FastClick, window);
