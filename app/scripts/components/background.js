/**
 * SVG Animation library
 */

(function(){

	var backgroundComponent = function(){

		var componentElement = $('.canvas');
		var current_frame = 0;
		var total_frames = 120;
		var handle = 0;
		var anims = [];
		var dd = {};

		var phoneLayers = [];
		var pcLayers = [];

		var layerOne, layerTwo;

		var detect = function(){
			return $('.homepage').length > 0 && Modernizr.svg;
		};

		var eneable = function(){
			attachEvents();
			console.log('enabled background!');
		};

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

		var init = function(){
			detect() && eneable();

			var s = Snap("#landing");
			Snap.load("/images/test-phone.svg", function (f) {
				layerOne = f.select('#Phone');
				layerTwo = f.select('#PC');
				layerTwo.attr('display', 'none');


				$.each(getPaths(layerOne), function(index, element){
					var length = element.getTotalLength();

					element.attr('stroke-dasharray', length + ' ' + length);
					element.attr('stroke-dashoffset', length);

					phoneLayers.push({ 'path': element, 'length': length });
				});

				$.each(getPaths(layerTwo), function(index, element){
					var length = element.getTotalLength();
					console.log(element, length);

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
								drawPCBackward();
				    	},1000);
				   } else {
				    	current_frame++;
							$.each(pcLayers, function(index, element){
								element.path.attr('stroke-dashoffset', Math.floor( element.length * (1 - progress) ) );
							});

				    	handle = window.requestAnimationFrame(drawPC);
				   }
				};

				var drawPCBackward = function(){
					layerOne.attr('display', 'none');
					layerTwo.attr('display', 'block');

					var progress = current_frame/total_frames;

				   if (progress >= 1) {

							$.each(pcLayers, function(index, element){
								element.path.attr('stroke-dashoffset', element.length );
							});

				    	window.cancelAnimationFrame(handle);

				    	current_frame = 0;
							layerOne.attr('display', 'block');
							layerTwo.attr('display', 'none');
							drawPhoneForward();

				   } else {
				    	current_frame++;
							$.each(pcLayers, function(index, element){
								element.path.attr('stroke-dashoffset', (-1) * Math.floor( element.length * (progress) ) );
							});

				    	handle = window.requestAnimationFrame(drawPCBackward);
				   }
				};

				var drawPhoneForward = function() {
				   var progress = current_frame/total_frames;
				   if (progress >= 1) {

							$.each(phoneLayers, function(index, element){
								element.path.attr('stroke-dashoffset', 0 );
							});

				    	window.cancelAnimationFrame(handle);
				    	setTimeout(function(){
								current_frame = 0;
								drawPhoneBackward();
							},1000);
				   } else {
				    	current_frame++;
							$.each(phoneLayers, function(index, element){
								element.path.attr('stroke-dashoffset', (-1) * Math.floor( element.length * (1 - progress) ) );
							});

				    	handle = window.requestAnimationFrame(drawPhoneForward);
				   }
				};

				var drawPhoneBackward = function() {
				   var progress = current_frame/total_frames;
				   if (progress >= 1) {

							$.each(phoneLayers, function(index, element){
								element.path.attr('stroke-dashoffset', element.length );
							});

				    	window.cancelAnimationFrame(handle);
							current_frame = 0;
							drawPC();
				   } else {
				    	current_frame++;
							$.each(phoneLayers, function(index, element){
								element.path.attr('stroke-dashoffset', Math.floor( element.length * (progress) ) );
							});

				    	handle = window.requestAnimationFrame(drawPhoneBackward);
				   }
				};

				drawPhoneForward();
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
