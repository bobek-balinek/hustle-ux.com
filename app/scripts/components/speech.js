/**
 * Speech component
 *
 * List of events
 *
 * onstart, onend, onerror, onresult, unsupported
 */
(function(){

	var speechComponent = function(){

		var options = {
			recognition: null,
			isEnabled: false,
			events: {}
		};

		var detect = function(){
			return ('webkitSpeechRecognition' in window);
		};

		var enable = function(){
			options.isEnabled = true;
			attachEvents();
		};

		var disable = function(){
			options.isEnabled = false;
			unbindEvents();
		};

		var state = function(){
			return isEnabled;
		};

		var stop = function(){
			console.log('STOP', window.recognizing);
			window.recognizing = false;
			return options.recognition.stop();
		};

		var start = function(){
			console.log('START', window.recognizing);
			if (window.recognizing) {
				options.recognition.stop();
				return;
			}

			stop();

			console.log('HERE',options.recognition);

			if(options.recognition){
				options.recognition.start();
			}
		};

		var init = function(data, optionsData){
			if( detect() ){
				_.extend(options, optionsData);

				detect(data) && enable();

				options.recognition = new webkitSpeechRecognition();
				options.recognition.continuous = true;
				options.recognition.interimResults = true;
				options.recognition.lang = 'en-GB';

				attachEvents();
			}
		};

		var attachEvents = function(data){
			data && _.extend(options.events, data);

			var keys = _.keys(options.events);
			_.each(keys, function(event_key){
				options.recognition[event_key] = options.events[event_key];
			});

			return false;
		};

		var unbindEvents = function(data){
			if( options.isEnabled ){
				var results = _.filter()

				$.each(results, function(key, eventBinding){
					 var type = key.split(' ');

					$(type[1]).hammer(options.touchSettings).off(type[0]);
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
			'attachEvents': attachEvents
		};
	};

	app.register('speech', speechComponent);

})(app, jQuery, window, _);

if( !Modernizr.touch ){

app.get('speech').attachEvents({
 'onstart': function() {
	window.recognizing = true;
	window.final_transcript = '';
	// showInfo('info_speak_now');
	// start_img.src = 'mic-animate.gif';
	// console.log('started');
	$('.speech_output').text('Listening...');
  },
  'onerror': function(event) {
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
  'onend': function(ev) {
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
  'onresult': function(event) {
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

$('.speech-on').on('click', function(event){
	if( window.recognizing ){
		app.get('speech').stop();
	}else{
		app.get('speech').start();
	}

});

}
