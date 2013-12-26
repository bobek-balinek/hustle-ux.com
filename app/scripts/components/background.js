/**
 * API Overview
 *
 * 1. Load the SVG file
 * 2. Setup Elements
 * 3. Kick off lines animations
 * 4. Kick off UI elements
 * 5. Interactive bits (circled sensors)
 */

(function(){

	var backgroundComponent = function(){

		var componentElement = $('.canvas');
		var anims = [];
		var dd = {};

		var detect = function(){
			return $('.homepage').length > 0;
		};

		var eneable = function(){
			attachEvents();
			console.log('enabled background!');
		};

		var bob = function(element, limit){

			if(element){
				element.attr('stroke-dashoffset', 0);
				return element.animate({'stroke-dashoffset': limit}, 2000, function(){

					return bob(element, limit);

				});
			}

			return ;
		};

		var dispatch = function(obj, length, duration){
			if(obj){
				return setTimeout(function(){
					obj.attr('stroke-dasharray', 200);
					obj.attr('stroke-dashoffset', 0);

					anims.push( bob( obj, length));
				}, duration);
			}

		};

		/**
		 * Utils
		 */

		 /**
		  * Get all paths from a context/layer
		  */
		var getPaths = function(context, layer){
			if(layer){
				return context.select(layer).selectAll('path');
			}

			return context.selectAll('path');
		};

		/**
		 * Phone offset
		 * @type {Number}
		 */
		var current_frame = 0;
		var total_frames = 320;
		var handle = 0;

		var init = function(){
			detect() && eneable();

			var s = Snap("#landing");
			Snap.load("/images/test-phone.svg", function (f) {
				var phoneLayers = [];
				var pcLayers = [];

				var layerOne = f.select('#Phone');
				var layerTwo = f.select('#PC');
				layerTwo.attr('display', 'none');


				$.each(getPaths(layerOne), function(index, element){
					var length = element.getTotalLength();

					element.attr('stroke-dasharray', length + ' ' + length);
					element.attr('stroke-dashoffset', length);

					phoneLayers.push({ 'path': element, 'length': length });
				});

				$.each(getPaths(layerTwo), function(index, element){
					var length = element.getTotalLength();

					element.attr('stroke-dasharray', length + ' ' + length);
					element.attr('stroke-dashoffset', length);

					pcLayers.push({ 'path': element, 'length': length });
				});

				var drawPC = function(){
					layerOne.attr('display', 'none');
					layerTwo.attr('display', 'block');

					var progress = current_frame/total_frames;

				   if (progress >= 1) {

							$.each(pcLayers, function(index, element){
								element.path.attr('stroke-dashoffset', 0 );
							});

				    	window.cancelAnimationFrame(handle);

				    	setTimeout(function(){
					    	current_frame = 0;
								layerOne.attr('display', 'block');
								layerTwo.attr('display', 'none');
								drawPhone();
				    	},1000);
				   } else {
				    	current_frame++;
							$.each(pcLayers, function(index, element){
								element.path.attr('stroke-dashoffset', Math.floor( element.length * (1 - progress) ) );
							});

				    	handle = window.requestAnimationFrame(drawPC);
				   }
				};

				var drawPhone = function() {
				   var progress = current_frame/total_frames;
				   if (progress >= 1) {

							$.each(phoneLayers, function(index, element){
								element.path.attr('stroke-dashoffset', 0 );
							});

				    	window.cancelAnimationFrame(handle);

				    	setTimeout(function(){
								current_frame = 0;
								drawPC();
				    	},1000);
				   } else {
				    	current_frame++;
							$.each(phoneLayers, function(index, element){
								element.path.attr('stroke-dashoffset', Math.floor( element.length * (1 - progress) ) );
							});

				    	handle = window.requestAnimationFrame(drawPhone);
				   }
				};

				drawPhone();
				s.append(f);
			});
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
