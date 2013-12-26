(function(){

	$(document).ready(function(){

	});

	/**
	 * Initialise FastClick
	 * @return {[type]} [description]
	 */
	window.addEventListener('load', function() {
    FastClick.attach(document.body);
	}, false);

})(jQuery, Modernizr, FastClick, window);
