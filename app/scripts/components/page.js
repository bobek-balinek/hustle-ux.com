(function(){

	var pageComponent = function(){

		var componentElement = $('.selector');
		var defaultOptions = {
			fingerTipElement: document.querySelector('.tip'),
			width: $(window).width(),
			height: $(window).height()
		};

		/** This component should happen on every page **/
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

			/** Desktop only **/
			if( !Modernizr.touch ){

				/** Attach Events for LeapMotion **/
				app.get('motion').attachEvents({
					'1fingers': fingerCallback,
					'3fingers': backgroundCallback,
					'5fingers': scrollCallback,
					'ready': connectCallback,
					'disconnect': disconnectCallback
				});

				/** Attach Events for Speech **/
				window.final_transcript = '';

				app.get('speech').addCommand(['project', 'projects', 'show me your work', 'your work', 'what do you do'], function(){
					window.location.href = '#projects';
				});

				app.get('speech').addCommand(['profile', 'about you', 'who are you', 'what is hustle', 'who is hustle', 'about hustle', 'about us'], function(){
					window.location.href = '#profile';
				});

				app.get('speech').addCommand(['top', 'go top', 'go to top', 'go back to the top'], function(){
					window.location.href = '#top';
				});

				/** First project - Adobe Reel Cut **/
				app.get('speech').addCommand(['project 1', 'project one', 'one', 'first project', 'adobe', 'reel cut'], function(){
					window.location.href = '/projects/adobe.html';
				});

				/** Second project - BBC **/
				app.get('speech').addCommand(['project 2', 'project two', 'two', '2', 'second project', 'bbc', 'family hub'], function(){
					window.location.href = '/projects/bbc.html';
				});

				/** Third project - Enrll **/
				app.get('speech').addCommand(['project 3', 'project three', 'three', '3', 'third project', 'enroll'], function(){
					window.location.href = '/projects/bbc.html';
				});

				/** Fourth project - Adidas Sync **/
				app.get('speech').addCommand(['project 4', 'project four', 'four', '4', 'fourth project', 'adidas', 'sync'], function(){
					window.location.href = '/projects/adidas.html';
				});

				/** Fith project - Learn the slr **/
				app.get('speech').addCommand(['project 5', 'project five', 'five', '5', 'fifth project', 'learn', 'camera', 'slr', 'photography'], function(){
					window.location.href = '/projects/learn-the-slr.html';
				});

				/** Sixth project - Learn the slr **/
				app.get('speech').addCommand(['project 6', 'project six', 'six', '6', 'fifth project', 'apple', 'school', 'science', 'ipad'], function(){
					window.location.href = '/projects/apple.html';
				});

				/**
				 * Standard API events
				 */
				app.get('speech').attachEvents({
				 'start': function() {
						window.recognizing = true;
						window.final_transcript = '';
						// showInfo('info_speak_now');
						// start_img.src = 'mic-animate.gif';
						// console.log('started');
						$('.speech_output').text('Listening...');

				  },
				  'error': function(event) {
						console.log('ERROR', event);
						// if (event.error == 'no-speech') {
						//   start_img.src = 'mic.gif';
						//   showInfo('info_no_speech');
						//   ignore_onend = true;
						// }
						// if (event.error == 'audio-capture') {
						//   start_img.src = 'mic.gif';
						//   showInfo('info_no_microphone');
						//   ignore_onend = true;
						// }
						// if (event.error == 'not-allowed') {
						//   if (event.timeStamp - start_timestamp < 100) {
						//     showInfo('info_blocked');
						//   } else {
						//     showInfo('info_denied');
						//   }
						//   ignore_onend = true;
						// }
				  },
				  'end': function(ev) {
						// window.recognizing = false;
						// app.get('speech').stop();

						// console.log(window.final_transcript);
						$('.speech_output').text(window.final_transcript);
						// if (ignore_onend) {
						//   return;
						// }
						// start_img.src = 'mic.gif';
						// if (!final_transcript) {
						//   showInfo('info_start');
						//   return;
						// }
						// showInfo('');
						// if (window.getSelection) {
						//   window.getSelection().removeAllRanges();
						//   var range = document.createRange();
						//   range.selectNode(document.getElementById('final_span'));
						//   window.getSelection().addRange(range);
						// }
						// if (create_email) {
						//   create_email = false;
						//   createEmail();
						// }
				  },
				  'result': function(event) {
						console.log('RESULT', event);
						// window.recognizing = false;
						app.get('speech').stop();
						$('.speech_output').text('Processing...');

						var interim_transcript = '';

						for (var i = event.resultIndex; i < event.results.length; ++i) {
						  if (event.results[i].isFinal) {
								window.final_transcript = event.results[i][0].transcript;
								$('.speech_output').text(window.final_transcript);

						  } else {
								window.final_transcript = event.results[i][0].transcript;
						  }
						}

						app.get('speech').stop();
						// window.final_transcript = capitalize(window.final_transcript);
						// final_span.innerHTML = linebreak(window.final_transcript);
						// interim_span.innerHTML = linebreak(interim_transcript);
						// if (window.final_transcript || interim_transcript) {
						//   showButtons('inline-block');
						// }
				  }
				});

				/**
				 * Switch classes if the viewport is over the image *
				 */
				if( $('body').hasClass('has-header-image') ){

					$('.page-wrap').on('scroll', function(event){

						if( $('.page-wrap').scrollTop() < $(window).height() ){
							$('body').addClass('is-over-picture');
						}else{
							$('body').removeClass('is-over-picture');
						}

					});
				}

				/**
				 * Click speech recognition
				 */
				$('.speech-on').on('click', function(event){

					if( window.recognizing ){
						app.get('speech').stop();
					}else{
						app.get('speech').start();
					}

				});

			}

			/** Initialise the Slider **/
			app.get('slider') && app.get('slider').init();
		};

		/**
		 * User is pointing with one finger
		 */
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
								/**
								 * TODO: 'idle' callback
								 */
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

		/**
		 * TODO: This may not be needed - three fingerss - maybe going back / forth in the projects ??
		 */
		var backgroundCallback = function(frame){
				var pos = frame.fingers[0].stabilizedTipPosition;
				var poss = app.get('motion').leapToScene(frame, pos, defaultOptions.width, defaultOptions.height);

				var velocX = Math.abs(frame.fingers[0].tipVelocity[0]);
				var velocY = Math.abs(frame.fingers[0].tipVelocity[1]);

				var deltaX = poss[0] + 44;
				var deltaY = poss[1] + 44;

				window.mouseX = deltaX * (velocX/ 100);
				window.mouseY = deltaY * (velocY / 100);

				return;
		};

		/**
		 * LeapMotion is connected
		 */
		var connectCallback = function(){
			$('html').addClass('motion');

			$('.devices-list .motion').trigger('click');

			setTimeout(function(){
				app.get('slider').nextSlide(1);
			},500);

			console.log('LeapMotion connected!');

			return;
		};

		/**
		 * LeapMotion is disconnected or there is an error
		 */
		var disconnectCallback = function(){
			$('html').removeClass('motion');

			console.log('LeapMotion disconnected!');

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

			return;
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

/**
 * TODO: Refactor there into a main.js file
 */
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

/**
 * Click event when a user is holding a finger steady for longer than 2 seconds
 */
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

