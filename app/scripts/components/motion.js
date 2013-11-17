/**
 *
 * Motion Component
 *
 * List of events:
 *
 * GESTURE: circle, swipe, screenTap, keyTap
 * FRAME: frame, 1fingers, 2fingers, 3fingers, down, up
 * CONTROLLER: ready, connect, disconnect, focus, blur, deviceConnected, deviceDisconnected
 *
 */
(function(){

	var motionComponent = function(){

		var options = {
			controllerEvents: ['ready', 'connect', 'disconnect', 'focus', 'blur', 'deviceConnected', 'deviceDisconnected'],
			controller: null,
			isEnabled: false,
			lastFrame: null,
			events: {},
			timeouts: {}
		};

		var detect = function(){

		};

		var enable = function(){
			options.isEnabled = true;
			attachEvents();
		};

		var disable = function(){
			options.isEnabled = false;
		};

		var state = function(){
			return isEnabled;
		};

		var init = function(data, optionsData){
			$.extend( options, optionsData );

			options.controller = new Leap.Controller({enableGestures: true});

			attachEvents(data);
			listen();

			detect(data) && enable();
		};

		var listen = function(callback){
			options.controller.loop(controllerLoop);
		};

		var dispatch = function(gesture, frameData){
			var name = gesture.type;

			if( gesture.state === 'stop' ){
				return options.events[name] && options.events[name](gesture, frameData);
			}

			return false;
		};

		var leapToScene = function(frame, leapPos, width, height ){

			  var iBox = frame.interactionBox;

			  var left = iBox.center[0] - iBox.size[0]/2;
			  var top = iBox.center[1] + iBox.size[1]/2;

			  var x = leapPos[0] - left;
			  var y = leapPos[1] - top;

			  x /= iBox.size[0];
			  y /= iBox.size[1];

			  x *= width;
			  y *= height;

			  return [ x , -y ];
		};

		var controllerLoop = function(frame) {
			if(!options.lastFrame){
				options.lastFrame = frame;
			}
			options.events['frame'] && options.events['frame'](frame);

			if( frame.fingers.length === options.lastFrame.fingers.length && frame.fingers.length > 0 ){
				options.events[frame.fingers.length+'fingers'] && options.events[frame.fingers.length+'fingers'](frame, options);
			}

			if(frame.gestures[0]){
				dispatch(frame.gestures[0], frame);
			}

			options.lastFrame = frame;
			return ;
		};

		var attachEvents = function(data){
			$.extend( options.events, data );

			/**
			 * Controller events
			 */
			for(var i=0; i < options.controllerEvents.length; i++){
				var eventType = options.controllerEvents[i];

				if(options.events.hasOwnProperty(eventType)){
					console.log(eventType + ' attached');
					options.controller.on(eventType, options.events[eventType])
				}
			};

			/** First Attachment **/
			if(!data){
				options.controller.on('ready', function() {
					console.log("ready");
					options.isEnabled = true;
				});
			}

			return;
		};

		var unbindEvents = function(key){
			if( key ){
				return options.events[key];
			}

			return options.events;
		};

		var getTimeouts = function(key){
			if( key ){
				return options.timeouts[key];
			}

			return options.timeouts;
		};

		var addTimeout = function(key, callback){
			options.timeouts[key] = callback;

			return callback;
		};

		var removeTimeout = function(key){
			if( options.timeouts[key] ){
				delete options.timeouts[key];
			}

			return false;
		};

		init();

		return {
			'init': init,
			'detect': detect,
			'enable': enable,
			'disable': disable,
			'timeouts': getTimeouts,
			'addTimeout': addTimeout,
			'removeTimeout': removeTimeout,
			'leapToScene': leapToScene,
			'attachEvents': attachEvents,
			'unbindEvents': unbindEvents
		};
	};

	app.register('motion', motionComponent);

})(jQuery, Leap, window);
