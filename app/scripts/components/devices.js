(function(){
	'use strict';

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
			if( !detect() ){
				return;
			}

			eneable();
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
		 * Toggle given link to be active
		 */
		var itemClick = function(event){
			event.preventDefault();
			resetSelected();
			markSelected();

			$(this).toggleClass('active');
		};

		/**
		 * Scroll down to the list of projects
		 */
		var desktopClick = function(){
			app.get('slider').destroy();

			$('.page-wrap').animate({'scrollTop': screenOffset}, 400);
		};

		/**
		 * Setup LeapMotion slider
		 */
		var motionClick = function(){
			app.get('slider').init({
				element: $('.slider__collection--motion'),
				slideSelector: 'li'
			});
		};

		/**
		 * Setup Voice recognition slider
		 */
		var speechClick = function(){
			app.get('slider').init({
				element: $('.slider__collection--speech'),
				slideSelector: 'li'
			});
		};

		/**
		 * Attach events
		 */
		var attachEvents = function(){
			$('.devices-list__link', componentElement).on('click', itemClick);

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
