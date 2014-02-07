(function(){
	'use strict';

	var pageComponent = function(){
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
			window.finalTranscript = '';

			if(!detect()){
				return;
			}

			eneable();
		};

		/**
		 * Navigate to page with a given hash
		 */
		var navigateToPage = function(page, hash){
			if(!hash){
				var hash = '';
			}

			if( window.location.pathname === page || page === '*' ){
				return window.location.href = hash;
			}

			return window.location.href = page + hash;

			return;
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
				app.get('speech').addCommand(['home', 'home page', 'root', 'get back', 'get back to the home page', 'back to home page'], function(){
					navigateToPage('/');
				});

				app.get('speech').addCommand(['project', 'projects', 'show me your work', 'your work', 'what do you do'], function(){
					navigateToPage('/', '#projects');
				});

				app.get('speech').addCommand(['profile', 'about you', 'who are you', 'what is hustle', 'who is hustle', 'about hustle', 'about us'], function(){
					navigateToPage('/', '#profile');
				});

				app.get('speech').addCommand(['top', 'go top', 'go to top', 'go back to the top'], function(){
					navigateToPage('*', '#top');
				});

				/** First project - Adobe Reel Cut **/
				app.get('speech').addCommand(['project 1', 'project one', 'one', 'first project', 'adobe', 'reel cut'], function(){
					navigateToPage('/projects/adobe.html', '');
				});

				/** Second project - BBC **/
				app.get('speech').addCommand(['project 2', 'project two', 'two', '2', 'second project', 'bbc', 'family hub'], function(){
					navigateToPage('/projects/bbc.html', '');
				});

				/** Third project - Enrll **/
				app.get('speech').addCommand(['project 3', 'project three', 'three', '3', 'third project', 'enroll'], function(){
					navigateToPage('http://enrll.com', '');
				});

				/** Fourth project - Adidas Sync **/
				app.get('speech').addCommand(['project 4', 'project four', 'four', '4', 'fourth project', 'adidas', 'sync'], function(){
					navigateToPage('/projects/adidas.html', '');
				});

				/** Fith project - Learn the slr **/
				app.get('speech').addCommand(['project 5', 'project five', 'five', '5', 'fifth project', 'learn', 'camera', 'slr', 'photography'], function(){
					navigateToPage('/projects/learn-the-slr.html', '');
				});

				/** Sixth project - Learn the slr **/
				app.get('speech').addCommand(['project 6', 'project six', 'six', '6', 'fifth project', 'apple', 'school', 'science', 'ipad'], function(){
					navigateToPage('/projects/apple.html', '');
				});

				/**
				 * Standard API events
				 */
				app.get('speech').attachEvents({
					start: function() {
						window.recognizing = true;
						window.finalTranscript = '';
						// showInfo('info_speak_now');
						// start_img.src = 'mic-animate.gif';
						console.log('started');
						$('.speech_output, .header__item--speech').addClass('active');
						$('.speech_output__text').text('Listening...');

					},
					error: function(event) {
						console.log('ERROR', event);
						if (event.error === 'no-speech') {
							console.log('ERROR', 'no-speech', event);
						  // start_img.src = 'mic.gif';
						  // showInfo('info_no_speech');
						  // ignore_onend = true;
						}
						if (event.error === 'audio-capture') {
							console.log('ERROR','audio-capture', event);
						  // start_img.src = 'mic.gif';
						  // showInfo('info_no_microphone');
						  // ignore_onend = true;
						}
						if (event.error === 'not-allowed') {
							console.log('ERROR','not-allowed', event);
						  // if (event.timeStamp - start_timestamp < 100) {
						  //   showInfo('info_blocked');
						  // } else {
						  //   showInfo('info_denied');
						  // }
						  // ignore_onend = true;
						}
					},
					end: function() {
						// window.recognizing = false;
						// app.get('speech').stop();

						// console.log(window.finalTranscript);
						$('.header__item--speech').removeClass('active');
						$('.speech_output__text').text(window.finalTranscript);
						// if (ignore_onend) {
						//   return;
						// }
						// start_img.src = 'mic.gif';
						// if (!finalTranscript) {
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
					result: function(event) {
						console.log('RESULT', event);
						// window.recognizing = false;

						$('.speech_output__text').text('Processing...');

						for (var i = event.resultIndex; i < event.results.length; ++i) {
							if (event.results[i].isFinal) {
								window.finalTranscript = event.results[i][0].transcript;
								$('.speech_output__text').text(window.finalTranscript);

							} else {
								window.finalTranscript = event.results[i][0].transcript;
							}
						}

						app.get('speech').stop();
						// window.finalTranscript = capitalize(window.finalTranscript);
						// final_span.innerHTML = linebreak(window.finalTranscript);
						// interim_span.innerHTML = linebreak(interim_transcript);
						// if (window.finalTranscript || interim_transcript) {
						//   showButtons('inline-block');
						// }
					}
				});

				/**
				 * Switch classes if the viewport is over the image *
				 */
				if( $('body').hasClass('has-header-image') ){

					$('.page-wrap').on('scroll', function(){

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
					event.preventDefault();

					if( window.recognizing ){
						app.get('speech').stop();
					}else{
						app.get('speech').start();
					}

				});

			}

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

								/** Execute the click event **/
								setTimeout(function(){
									if( $(element)[0] ) {
										$(element)[0].click();
									}
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
