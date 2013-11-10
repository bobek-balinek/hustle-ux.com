(function(){

	var backgroundComponent = function(){

		var componentElement = $('.canvas');

		var detect = function(){
			return Modernizr.canvas
		};

		var eneable = function(){
			attachEvents();
			console.log('enabled!');
		};

		var init = function(){
			detect() && eneable();
		};

		var attachEvents = function(){

		};

		var unbindEvents = function(){

		};

		init();

		return {
			'init': init,
			'detect': detect,
			'eneable': eneable,
			'attachEvents': attachEvents,
			'unbindEvents': unbindEvents
		};
	};

	app.register('background', backgroundComponent);
})(jQuery, Modernizr, app);
