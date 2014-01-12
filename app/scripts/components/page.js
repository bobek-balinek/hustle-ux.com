(function(){

	var pageComponent = function(){

		var componentElement = $('.selector');
		var defaultOptions = {
			fingerTipElement: document.querySelector('.tip'),
			width: $(window).width(),
			height: $(window).height()
		};

		var detect = function(){
			return true;
		};

		var eneable = function(){
			attachEvents();
		};

		var init = function(){
			window.tt = null;
			window.clickedElement = false;

			detect() && eneable();
		};

		var attachEvents = function(){
			if( !Modernizr.touch ){
				app.get('motion').attachEvents({
					'1fingers': fingerCallback,
					// 'screenTap': tapCallback,
					'3fingers': backgroundCallback,
					'5fingers': scrollCallback,
					'ready': connectCallback,
					'disconnect': disconnectCallback
				});

				if( $('body').hasClass('has-header-image') ){

					$('.page-wrap').on('scroll', function(event){

						if( $('.page-wrap').scrollTop() < $(window).height() ){
							$('body').addClass('is-over-picture');
						}else{
							$('body').removeClass('is-over-picture');
						}

						var offset = 150 * ( $('.page-wrap').scrollTop() / $(window).height() );
						// $('#landing').css('background-position')
					});

				}
			}

			app.get('slider') && app.get('slider').init();
		};

		var fingerCallback = function(frame){
			if(frame.fingers[0]){

				defaultOptions.fingerTipElement.className = 'tip';

				var pos = frame.fingers[0].stabilizedTipPosition;
				var poss = app.get('motion').leapToScene(frame, pos, defaultOptions.width, defaultOptions.height);

				var deltaX = poss[0] + 44;
				var deltaY = poss[1] + 44;

				window.mouseX = deltaX;
				window.mouseY = deltaY;

				defaultOptions.fingerTipElement.style.left = deltaX + 'px';
				defaultOptions.fingerTipElement.style.top = deltaY + 'px';

				var gammaX = Math.abs(frame.fingers[0].tipVelocity[0]);
				var gammaY = Math.abs(frame.fingers[0].tipVelocity[1]);
				var gammaZ = Math.abs(frame.fingers[0].tipVelocity[2]);

				if(gammaX < 2 && gammaY < 2 && gammaZ < 2){

					$(defaultOptions.fingerTipElement).addClass('animated');

					if(!window.tt){
							var element = document.elementFromPoint( deltaX, deltaY );

							if( $(element).length && $(element).prop('tagName') !== 'HTML' && $(element).prop('tagName') !== 'BODY'){

								// Initialize click event
								initTip(function(){
									$(defaultOptions.fingerTipElement).removeClass('animated');
									setTimeout(function(){
											$(element)[0] && $(element)[0].click();
									},0);
								});

							}
					}
				}
			}
		};

		var backgroundCallback = function(frame){
				var pos = frame.fingers[0].stabilizedTipPosition;
				var poss = app.get('motion').leapToScene(frame, pos, defaultOptions.width, defaultOptions.height);

				var velocX = Math.abs(frame.fingers[0].tipVelocity[0]);
				var velocY = Math.abs(frame.fingers[0].tipVelocity[1]);

				var deltaX = poss[0] + 44;
				var deltaY = poss[1] + 44;

				window.mouseX = deltaX * (velocX/ 100);
				window.mouseY = deltaY * (velocY / 100);

				return ;
		};

		/**
		 * Example of Tap to select
		 */
		var tapCallback = function(gesture, frame){
			var cords = app.get('motion').leapToScene(frame, gesture.position, $(window).width(), $(window).height());

			setTimeout(function(){
				var element = document.elementFromPoint( ( cords[0] + 44), (cords[1] + 44));
				var old = 1;

				if( $(element).prop('tagName') !== 'HTML' || $(element).prop('tagName') !== 'BODY' ){

					$(element).css('-webkit-transform','scale(0.9)');
					setTimeout(function(){
						$(element).css('-webkit-transform','scale(1)');
					},400);
				}

			},200);

			return ;
		};

		/**
		 * Connected & disconnected device callbacks
		 */
		var connectCallback = function(){
			$('html').addClass('motion');
			console.log('connected!');

			return;
		};

		var disconnectCallback = function(){
			$('html').removeClass('motion');
			console.log('disconnected!');

			return;
		};

		/**
		 * Scrolling callback
		 */
		var scrollCallback = function(frame, options){
			var pos = frame.pointables[0].stabilizedTipPosition;
			if(options.lastFrame.pointables.length > 0){
				var delta = pos[1] - options.lastFrame.pointables[0].stabilizedTipPosition[1];

				if( frame.hands[0] && frame.hands[0].palmVelocity ){
					defaultOptions.fingerTipElement.className = 'tip scroll';
					var veloc = Math.abs(frame.hands[0].palmVelocity[1]);
					var offset = ( $('.page-wrap').scrollTop() + (delta * (veloc / 100) ) );
					$('.page-wrap').scrollTop( offset );
				}

			}

			return ;
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

	app.register('page', pageComponent);

})(jQuery, Modernizr, app);


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;
}

function initTip(callback){
		window.tt = true;
    var progress = 0;
    var dn = document.getElementById("arc1");

    var timer = setInterval(function(){
        if(progress <= 100){
            var angle = (progress * 3.6);
            dn.setAttribute("d", describeArc(32,32 , 28, 0, angle));
            progress += 1;
        }else{
						clearTimeout(timer);
	        	window.tt = false;
            progress = 0;
            callback();
        }
    },15);
}

