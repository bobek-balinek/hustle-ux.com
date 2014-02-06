/**
 * Speech component
 *
 * List of events:
 * onstart, onend, onerror, onresult, unsupported
 */

(function(){
	'use strict';

	var speechComponent = function(){
		var RecognitionObject = (window.SpeechRecognition ||
													window.webkitSpeechRecognition ||
													window.mozSpeechRecognition ||
													window.msSpeechRecognition ||
													window.oSpeechRecognition);

		var options = {
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
			for ( var i = event.resultIndex; i < event.results.length; ++i ) {
				if (event.results[i].isFinal) {
					window.finalTranscript = event.results[i][0].transcript;
					$('.speech_output').text(window.finalTranscript);
					matchCommand(window.finalTranscript, event);

				} else {
					window.finalTranscript = event.results[i][0].transcript;
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
			options.recognition = new RecognitionObject();
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
			if( !detect() ){
				return;
			}

			_.extend(options, optionsData);
			enable();
			attachEvents();
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
			options.recognition.onstart = onStart;
			options.recognition.onend = onEnd;
			options.recognition.onerror = onError;
			options.recognition.onresult = onResult;

			return true;
		};

		/**
		 * Add a new set of commands
		 */
		var addCommand = function(name, callback){
			if(!name){
				return;
			}

			if( _.isArray(name) ){
				_.each(name, function(command){
					options.commands[command] = callback;
				});

			}else{
				options.commands[name] = callback;
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
				_.each(keys, function(eventKey){
					options.recognition[eventKey] = options.events[eventKey];
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
			'getState': state,
			'getCommands': getCommands,
			'addCommand': addCommand,
			'removeCommand': removeCommand,
			'attachEvents': attachEvents
		};
	};

	app.register('speech', speechComponent);

})(app, jQuery, window, _);
