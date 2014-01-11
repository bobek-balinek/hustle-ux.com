(function(){

	var devicesComponent = function(){

		var componentElement = $('.devices-list');

		var detect = function(){
			return componentElement.length > 0;
		};

		var eneable = function(){
			attachEvents();
		};

		var init = function(){
			detect() && eneable();
		};

		var markSelected = function(){
			componentElement.addClass('selected');
		};

		var resetSelected = function(){
			componentElement.removeClass('selected');
			componentElement.find('a').removeClass('active');
		};

		var attachEvents = function(){
			var offset = $('section.work').offset();

			/**
			 * Setup LeapMotion slider
			 */
			$('.motion', componentElement).on('click', function(event){
				event.preventDefault();
				resetSelected();
				markSelected();

				$(this).toggleClass('active');

				app.get('slider').init({
					element: $('.slider__collection--motion'),
					slideSelector: 'li'
				});

			});

			/**
			 * Scroll down to the list of projects
			 */
			$('.desktop', componentElement).on('click', function(event){
				event.preventDefault();
				resetSelected();

				app.get('slider').destroy();

				offset && $('.page-wrap').animate({'scrollTop': offset.top}, 400);
			});

			/**
			 * Setup Voice recognition slider
			 */
			$('.speech', componentElement).on('click', function(event){
				event.preventDefault();
				resetSelected();
				markSelected();

				$(this).toggleClass('active');

				app.get('slider').init({
					element: $('.slider-speech'),
					slideSelector: 'li'
				});

				$('.speech-on').removeClass('hidden');

				app.get('slider').destroy();
			});

		};

		var unbindEvents = function(){
			$('.motion', componentElement).off('click');
			$('.desktop', componentElement).off('click');
			$('.speech', componentElement).off('click');
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
