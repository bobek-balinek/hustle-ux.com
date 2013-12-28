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
				if( animations[current + 1] ){
					current++;
				}else{
					current = 0;
				}

				animations[current].progress = 0;
				animations[current].handler = 0;
				animations[current].current_frame = 0;
				return animations[current].draw();
			};

			$.each(animations, function(index, animation){
				animation.current_frame = 0;
				animation.handler = 0;

				animation.draw = function(){
					animation.progress = animation.current_frame/animation.duration;

					if (animation.progress >= 1) {
						window.cancelAnimationFrame(animation.handler);

						if(animation.endCallback){
							animation.endCallback(animationCallback);
						}else{
							animationCallback();
						}
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
		var phoneForwardAnimation = new animation('phoneForward', 240, function(progress){
				return $.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', (-1) * Math.floor( (2 * element.length) * (0.5 - progress) ) );
				});
			},function(callback){
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
		var monitorForwardAnimation = new animation('monitorForward', 240, function(progress){
				return $.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', Math.floor( (2 * element.length) * (0.5 - progress) ) );
				});

			}, function(callback){
				layerOne.attr('display', 'block');
				layerTwo.attr('display', 'none');

				$.each(this.elements, function(index, element){
					element.path.attr('stroke-dashoffset', element.length );
				});

				return callback();
			});

		var equation = function(pox, pow){
			var x = (2 * Math.PI) * pox;
			var d = (1 + Math.cos( x ) );
			return d * 15 * pow;
			// return ((600 / pow) * ( Math.pow(pox, 2) ) - ((600 / pow) * pox) + 150);
		};

				/**
				 * Forward animation
				 */
				var dn = new animation('2_button', 240, function(progress){
					var pixel_offset = 0;
					var offset;
					var right_elements = this.elements[0];
					var left_elements = this.elements[1];

					for( var i = 0; i < right_elements.length; i++ ){

						var prog = progress;
						offset = (-1 * pixel_offset) + equation( prog, (i+1) );

						right_elements[i].attr({
							transform: "t"+offset+",0"
						});
					}

					for( var i = 0; i < left_elements.length; i++ ){

						var prog = progress;
						offset = (pixel_offset) + ((-1) * equation( prog, (i+1) ) );

						left_elements[i].attr({
							transform: "t"+offset+",0"
						});
					}

				}, function(callback){
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
				});

				$.each(getPaths(layerTwo), function(index, element){
					var length = element.getTotalLength();

					element.attr('stroke-dasharray', length + ' ' + length);
					element.attr('stroke-dashoffset', length);

					monitorForwardAnimation.elements.push({ 'path': element, 'length': length });
				});

				var ico = f.selectAll('#header_ico, #line_1_ico, #line_2_ico, #line_3_ico');
				var btn = f.selectAll('#header_btn1, #header_btn2, #line_1_btn, #line_2_btn, #line_3_btn');

				dn.elements.push(btn);
				dn.elements.push(ico);

				/**
				 * Prepare animations
				 */
				anims.push(phoneForwardAnimation);
				anims.push(monitorForwardAnimation);

				/**
				 * Start animations
				 */
				var mainAnimation = new animationQueue(anims);
				// var contentsAnimation = new animationQueue([dn]);
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
