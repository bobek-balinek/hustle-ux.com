(function(){

	var devicesComponent = function(){

		var componentElement = $('.devices-list');
		var screenOffset = 0;

		var detect = function(){
			return componentElement.length > 0;
		};

		var eneable = function(){
			attachEvents();
		};

		var init = function(){
			detect() && eneable();

			screenOffset = $('section.work').offset() ? $('section.work').offset().top : 0;
		};

		var markSelected = function(){
			componentElement.addClass('selected');
		};

		var resetSelected = function(){
			componentElement.removeClass('selected');
			componentElement.find('a').removeClass('active');
		};

		/**
		 * Scroll down to the list of projects
		 */
		var desktopClick = function(event){
			event.preventDefault();
			resetSelected();

			app.get('slider').destroy();

			$('.page-wrap').animate({'scrollTop': screenOffset}, 400);
		};

		/**
		 * Setup LeapMotion slider
		 */
		var motionClick = function(event){
			event.preventDefault();
			resetSelected();
			markSelected();

			$(this).toggleClass('active');

			app.get('slider').init({
				element: $('.slider__collection--motion'),
				slideSelector: 'li'
			});
		};

		/**
		 * Setup Voice recognition slider
		 */
		var speechClick = function(event){
			event.preventDefault();
			resetSelected();
			markSelected();

			$(this).toggleClass('active');

			app.get('slider').init({
				element: $('.slider__collection--speech'),
				slideSelector: 'li'
			});

			$('.speech-on').removeClass('hidden');
		};

		// Attach Events
		var attachEvents = function(){
			$('.motion', componentElement).on('click', motionClick);
			$('.desktop', componentElement).on('click', desktopClick);
			$('.speech', componentElement).on('click', speechClick);
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
