/**
 * Animation Shim
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
 * SVG Animation library
 */
(function(){

	function precise_round(num,decimals){
		return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
	}

	var backgroundComponent = function(){

		var componentElement = $('.canvas');
		var anims = [];
		var layerOne, layerTwo, snap;

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
		 * Event Dispatcher
		 */
		function animationQueue(animations){
			var current = 0;

			var animationCallback = function(){
				if(animations[current+ 1]){
					current++;
					animations[current].progress = 0;
					animations[current].current_frame = 0;
					return animations[current].draw();
				}else{
					current = 0;
					animations[current].progress = 0;
					animations[current].current_frame = 0;
					return animations[current].draw();
				}
			};

			$.each(animations, function(index, animation){
				animation.current_frame = 0;
				animation.handler = 0;

				animation.draw = function(){
					animation.progress = animation.current_frame/animation.duration;

					if (animation.progress >= 1) {

						if(animation.endCallback){
							animation.endCallback(animationCallback);
						}else{
							animationCallback();
						}

						window.cancelAnimationFrame(animation.handler);
					}else{
						animation.current_frame++;

						animation.drawCallback && animation.drawCallback(animation.progress);
						animation.handler = window.requestAnimationFrame(animation.draw);
					}

					return true;
				};
			});

			return animations[current].draw();
		};

		/**
		 * Animation constructor
		 */
		function animation(name, duration, draw, end){
			return {
				'name': name,
				'elements': [],
				'current_frame': 0,
				'duration': duration,
				'handler': 0,
				'progress': 0,
				'drawCallback': draw,
				'endCallback': end
			};
		};


		/**
		 * Animation to draw the phone forward
		 */
		var phoneForwardAnimation = new animation('phoneForward', 90, function(progress){
				return $.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', (-1) * Math.floor( element.length * (1 - progress) ) );
				});
			},function(callback){
				layerTwo.attr('display', 'none');

				$.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', 0 );
				});

				return callback();
			});

		/**
		 * Animation to draw the phone backward
		 */
		var phoneBackwardAnimation = new animation('phoneBackward', 90, function(progress){
				return $.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', Math.floor( element.length * (progress) ) );
				});

			}, function(callback){
				layerOne.attr('display', 'none');
				layerTwo.attr('display', 'block');

				$.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', element.length );
				});

				return callback();
			});

		/**
		 * Animation to draw the monitor dorward
		 */
		var monitorForwardAnimation = new animation('monitorForward', 90, function(progress){
				return $.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', Math.floor( element.length * (1 - progress) ) );
				});

			}, function(callback){
				$.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', 0 );
				});

				return callback();
			});

		/**
		 * Animation to draw the phone backward
		 */
		var monitorBackwardAnimation = new animation('monitorBackward', 90, function(progress){
				return $.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', (-1) * Math.floor( element.length * (progress) ) );
				});

			}, function(callback){
				layerOne.attr('display', 'block');
				layerTwo.attr('display', 'none');

				$.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', element.length );
				});

				return callback();
			});

		/**
		 * Initialise the component
		 */
		var init = function(){
			detect() && eneable();

			if(!detect())
				return;

			/**
			 * Load the SVG file in
			 */
			snap = Snap("#landing .container");
			Snap.load("/images/test-phone.svg", function (f) {
				layerOne = f.select('#Phone');
				layerTwo = f.select('#PC');

				/**
				 * Get elements and put them in specific animations
				 */
				$.each(getPaths(layerOne), function(index, element){
					var length = element.getTotalLength();

					element.attr('stroke-dasharray', length + ' ' + length);
					element.attr('stroke-dashoffset', length);

					phoneForwardAnimation.elements.push({ 'path': element, 'length': length });
					phoneBackwardAnimation.elements.push({ 'path': element, 'length': length });
				});

				$.each(getPaths(layerTwo), function(index, element){
					var length = element.getTotalLength();

					element.attr('stroke-dasharray', length + ' ' + length);
					element.attr('stroke-dashoffset', length);

					monitorForwardAnimation.elements.push({ 'path': element, 'length': length });
					monitorBackwardAnimation.elements.push({ 'path': element, 'length': length });
				});

				/**
				 * Prepare animations
				 */
				anims.push(phoneForwardAnimation);
				anims.push(phoneBackwardAnimation);
				anims.push(monitorForwardAnimation);
				anims.push(monitorBackwardAnimation);

				/**
				 * Start animations
				 */
				var mainAnimation = new animationQueue(anims);
				snap.append(f);
			});
		};

		var getElement = function(){
			return snap;
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
			'getElement': getElement,
			'attachEvents': attachEvents,
			'unbindEvents': unbindEvents
		};
	};

	app.register('background', backgroundComponent);
})(jQuery, Modernizr, app);
