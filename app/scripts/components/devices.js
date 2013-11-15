(function(){

	var devicesComponent = function(){

		var componentElement = $('.devices');

		var detect = function(){
			return componentElement.length > 0;
		};

		var eneable = function(){
			attachEvents();
			console.log('enabled!');
		};

		var init = function(){
			detect() && eneable();
		};

		var attachEvents = function(){

			$('.motion', componentElement).on('click', function(event){
				event.preventDefault();

				$('.top-bar').toggleClass('open');
				$(this).toggleClass('active');

				/**
				 * app.get('slider').show('motion');
				 */
			});

			$('.desktop', componentElement).on('click', function(event){
				event.preventDefault();

				var offset = $('section.work').offset();
				$('.page-wrap').animate({'scrollTop': offset.top}, 400);
			});

		};

		var unbindEvents = function(){
			$('.motion', componentElement).off('click');
			$('.desktop', componentElement).off('click');
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

	app.register('devices', devicesComponent);
})(jQuery, app);
