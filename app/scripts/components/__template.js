(function(){

	var __NAME__Component = function(){

		var componentElement = $('.selector');

		var detect = function(){
			return;
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

	app.register('__NAME__', __NAME__Component);

})(jQuery, Modernizr, app);
