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
			});

			$('.desktop', componentElement).on('click', function(event){
				event.preventDefault();

				var offset = $('section.work').offset();
				$('html, body').scrollTop(offset.top);
				console.log(offset.top);
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
