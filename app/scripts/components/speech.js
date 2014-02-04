/**
 * Speech component
 *
 * List of events:
 * onstart, onend, onerror, onresult, unsupported
 */

(function(){

	var speechComponent = function(){

		var options = {
			recognitionObject: (window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition),
			recognition: null,
			isEnabled: false,
			recognitionOptions: {
				continuous : true,
				interimResults : true,
				lang : 'en-GB'
			},
			events: {
				start: [],
				error: [],
				end: [],
				result: [],
				resultMatch: [],
				resultNoMatch: [],
				errorNetwork: [],
				errorPermissionBlocked: [],
				errorPermissionDenied: []
			},
			commands: {}
		};

		/**
		 * Speech Recognition callbacks
		 *
		 * onstart, onend, onerror, onresult, unsupported
		 */

		var onStart = function(event){
			return invokeCallbacks(options.events.start, event);
		};

		var onEnd = function(event){
			return invokeCallbacks(options.events.end, event);
		};

		var onError = function(event){
			return invokeCallbacks(options.events.error, event);
		};

		/** TODO: INVOKE CALLBACKS WITH RESULT MATCH **/
		var onResult = function(event){
			var interim_transcript = '';

			for (var i = event.resultIndex; i < event.results.length; ++i) {
			  if (event.results[i].isFinal) {
					window.final_transcript = event.results[i][0].transcript;
					$('.speech_output').text(window.final_transcript);
					matchCommand(window.final_transcript, event);

			  } else {
					window.final_transcript = event.results[i][0].transcript;
			  }
			}

			return invokeCallbacks(options.events.result, event);
		};

		/**
		 * Component methods
		 */
		var detect = function(){
			return options.recognitionObject !== undefined;
		};

		var enable = function(){
			options.recognition = new webkitSpeechRecognition();
			_.extend(options.recognition, options.recognitionOptions);

			options.isEnabled = true;
			$('html').addClass('speech');
		};

		var disable = function(){
			options.isEnabled = false;
			unbindEvents();
		};

		var state = function(){
			return isEnabled;
		};

		var stop = function(){
			window.recognizing = false;
			return options.recognition.stop();
		};

		var start = function(){

			if (window.recognizing) {
				options.recognition.stop();
				return;
			}

			stop();

			if(options.recognition){
				options.recognition.start();
			}
		};

		var invokeCallbacks = function(callbacks, data){
			_.each(callbacks, function(callback){
				return callback && callback(data);
			});
		};

		var init = function(data, optionsData){
			if( detect() ){
				_.extend(options, optionsData);
				enable();
				attachEvents();
			}
		};

		var attachEvents = function(data){

			/** Process provided callbacks **/
			if(data){
				var keys = _.keys(data);
				_.each(keys, function(key){
					options.events[key].push(data[key]);
				});
			}

			/** Apply native callbacks **/
			options.recognition['onstart'] = onStart;
			options.recognition['onend'] = onEnd;
			options.recognition['onerror'] = onError;
			options.recognition['onresult'] = onResult;

			return true;
		};

		/**
		 * Add a new set of commands
		 */
		var addCommand = function(name, callback){
			if(!name)
				return;

			if( _.isObject(name) ){

				_.extend(options.commands, name);

			}else{

				if( _.isArray(name) ){
					_.each(name, function(command){
						options.commands[command] = callback;
					});

				}else{
					options.commands[name] = callback;
				}
			}

			return true;
		};

		var removeCommand = function(name){
			return _.remove(options.commands, name);
		};

		var getCommands = function(){
			return options.commands;
		};

		var matchCommand = function(query, event){
			if( options.commands[query] ){
				options.commands[query](event);

				invokeCallbacks(options.events.resultMatch, event);
			}

			invokeCallbacks(options.events.resultNoMatch, event);
		};

		var unbindEvents = function(data){
			if( options.isEnabled ){

				var keys = _.keys(options.events);
				_.each(keys, function(event_key){
					options.recognition[event_key] = options.events[event_key];
				});

				_.remove(options.events, data);
				return true;
			}

			return false;
		};

		init();

		return {
			'init': init,
			'start': start,
			'stop': stop,
			'detect': detect,
			'enable': enable,
			'disable': disable,
			'getCommands': getCommands,
			'addCommand': addCommand,
			'removeCommand': removeCommand,
			'attachEvents': attachEvents
		};
	};

	app.register('speech', speechComponent);

})(app, jQuery, window, _);


if( !Modernizr.touch ){

	/**
	 * When a user says projects, locate the user to the projects screen
	 */
	app.get('speech').addCommand('projects', function(){
		window.location.href = '#projects';
	});

	app.get('speech').addCommand('project', function(){
		window.location.href = '#projects';
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

	window.final_transcript = '';

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
