/**
 * Slider component
 *
 * What is needs:
 * - Main element
 * - Child selector (slide)
 * - Current index
 * - List of content elements
 * - List of events for next/prev
 *
 * Methods:
 * - currentIndex()
 * - nextSlide()
 * - previousSlide()
 * - close()
 * - open()
 *
 * app.get('slider').setElement( $('.bobby-slider') );
 *
 * app.get('slider').init( $('.motion li') , {
 * 	'click .bob': fn(),
 * 	'click .not': fn()
 * });
 *
 */

(function(){

	$.fn.bindMany = function(events) {
		for (var key in events) {
			var match = key.match(/^(\S+)\s*(.*)$/);

			var name = match[1];
			var selector = match[2];
			var fn = events[key];

			$(this).on(name, selector, fn);
		}
	};

	var sliderComponent = function(){
		var options = {
			slideSelector: null,
			element: null,
			events: {},
			currentIndex: 0
		};

		var detect = function(){
			return true;
		};

		var eneable = function(){
			attachEvents();

			getElement().addClass('active');

			setActive(0);
			console.log('enabled slider');
		};

		var init = function(optionsData){
			$.extend( options, optionsData );

			detect() && eneable();
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
			return getElement().bindMany(options.events);
		};

		var unbindEvents = function(){

		};

		var resetActive = function(){
			return getElement().find(options.slideSelector).removeClass('active');
		};

		var setActive = function(index){
			resetActive();
			return getElement().find(options.slideSelector).eq(index).addClass('active');
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

		// init(); only initialise when needed - requires objects

		return {
			'init': init,
			'detect': detect,
			'eneable': eneable,
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
