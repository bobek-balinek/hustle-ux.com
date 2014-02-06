/**
 * Slider component
 */

(function(){

	var sliderComponent = function(){
		var options = {
			mainElement: $('.slider'),
			slideSelector: 'li',
			element: null,
			events: {},
			currentIndex: 0
		};

		var detect = function(){
			return true;
		};

		var eneable = function(){
			attachEvents();
			console.log('enabled slider');
		};

		var init = function(optionsData){
			$.extend( options, optionsData );

			detect() && eneable();
			destroy();

			setActive(0);
		};

		var destroy = function(){
			resetActive();
			$('#landing .container').removeClass('off');
			options.mainElement.find('[class^=slider__collection]').removeClass('active').find(options.slideSelector).removeClass('active');
			getElement().removeClass('active');
			deactivateComponent();
		};

		var setElement = function(element){
			if(element){
				options.element = element;
				return true;
			}

			return ;
		};

		var getElement = function(){
			return $(options.element);
		};

		var attachEvents = function(){
			unbindEvents();

			$('.slider__controls--prev', options.mainElement ).on('click', function(event){
				event.preventDefault();
				previousSlide();
				return ;
			});

			$('.slider__controls--next', options.mainElement ).on('click', function(event){
				event.preventDefault();
				nextSlide();
				return ;
			});

			return getElement().bindMany(options.events);
		};

		var unbindEvents = function(){
			$('.slider__controls--prev', options.mainElement ).off('click');
			$('.slider__controls--next', options.mainElement ).off('click');
		};

		var activateComponent = function(){
			options.element && options.mainElement.addClass('active');
			return;
		};

		var deactivateComponent = function(){
			options.element && options.mainElement.removeClass('active');
			return;
		};

		var resetActive = function(){
			return getElement().find(options.slideSelector).removeClass('active');
		};

		var setActive = function(index){
			activateComponent();

			if(getElement().length){

				getElement().addClass('active');
				$('#landing .container').addClass('off');
				resetActive();

				return setTimeout(function(){
					getElement().find(options.slideSelector).eq(index).addClass('active');
				},500);

			}

			return false;
		};

		var setSlide = function(index){
			if( getElement().find(options.slideSelector).eq(index) ){
				options.currentIndex = index;

				return setActive(index);
			}
		};

		var nextSlide = function(){
			if( getElement().find(options.slideSelector).eq(options.currentIndex + 1).length ){
				options.currentIndex++;

				return setActive(options.currentIndex);
			}else{

				return setSlide(0);
			}
		};

		var previousSlide = function(){
			if( getElement().find(options.slideSelector).eq(options.currentIndex - 1).length ){
				options.currentIndex--;

				return setActive(options.currentIndex);
			}else{

				return setSlide(0);
			}
		};

		var getCurrentSlide = function(name){
			return getElement().find(options.slideSelector).eq(options.currentIndex);
		};

		return {
			'init': init,
			'detect': detect,
			'eneable': eneable,
			'destroy': destroy,
			'setActive': setActive,
			'nextSlide': nextSlide,
			'setElement': setElement,
			'getElement': getElement,
			'attachEvents': attachEvents,
			'unbindEvents': unbindEvents,
			'previousSlide': previousSlide,
			'getCurrentSlide': getCurrentSlide
		};
	};

	app.register('slider', sliderComponent);

})(jQuery, Modernizr, app);
