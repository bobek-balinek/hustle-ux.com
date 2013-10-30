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
			_.extend(options, optionsData);

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
		};

		var attachEvents = function(data){

			_.extend(options.events, data);

			/** First Attachment **/
			if(!data){
				options.controller.on('ready', function() {
					console.log("ready");
					options.isEnabled = true;
				});
			}
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

var width = $(window).width();
var height = $(window).height();

window.tt = null;

window.clickedElement = false;

/**
 * Example of 1 finger hover
 */
var fingerTipElement = document.querySelector('.tip');

var fingerCallback = function(frame){

	// console.log(frame.fingers.length);

	// for(var i=0; i < frame.fingers.length; i++){
	if(frame.fingers[0]){
		// $(fingerTipElement).removeClass('scroll');
		fingerTipElement.className = 'tip';

		var pos = frame.fingers[0].stabilizedTipPosition;
		var poss = app.get('motion').leapToScene(frame, pos, width, height);

		var deltaX = poss[0] + 44;
		var deltaY = poss[1] + 44;

		window.mouseX = deltaX;
		window.mouseY = deltaY;

		// $('.tip:eq('+i+')').css('left', deltaX);
		// $('.tip:eq('+i+')').css('top', deltaY);

		fingerTipElement.style.left = deltaX + 'px';
		fingerTipElement.style.top = deltaY + 'px';

		var gammaX = Math.abs(frame.fingers[0].tipVelocity[0]);
		var gammaY = Math.abs(frame.fingers[0].tipVelocity[1]);
		var gammaZ = Math.abs(frame.fingers[0].tipVelocity[2]);


		// console.log(pos[2]);
		// if( pos[2] < -50 ){
		// 	var element = document.elementFromPoint( ( poss[0] + 44), (poss[1] + 44));
		// 	$('.tip:eq('+i+')').addClass('in');

		// 	if( !app.get('motion').timeouts('clickEvent') ){
		// 		app.get('motion').addTimeout('clickEvent', setTimeout(function(){
		// 			$(element).click('click');
		// 			// $(element).trigger('click');
		// 			console.log('click!', element);
		// 			app.get('motion').removeTimeout('clickEvent');
		// 			$('.tip:eq('+i+')').removeClass('in');
		// 		},1000) );
		// 	}
		// }else{
		// 	$('.tip:eq('+i+')').removeClass('in');
		// }

		if(gammaX < 2 && gammaY < 2 && gammaZ < 2){
			// console.log(gammaX, gammaY, gammaZ);
			// var tip = $('.tip:eq('+i+')')

			$(fingerTipElement).addClass('animated pulse');

			window.tt = setTimeout(function(){
				$(fingerTipElement).removeClass('animated pulse');
			},1000);
		}
	}
};

var backgroundCallback = function(frame){
		var pos = frame.fingers[0].stabilizedTipPosition;
		var poss = app.get('motion').leapToScene(frame, pos, width, height);

		var velocX = Math.abs(frame.fingers[0].tipVelocity[0]);
		var velocY = Math.abs(frame.fingers[0].tipVelocity[1]);

		var deltaX = poss[0] + 44;
		var deltaY = poss[1] + 44;

		// console.log(frame.fingers[0]);

		window.mouseX = deltaX * (velocX/ 100);
		window.mouseY = deltaY * (velocY / 100);
};

/**
 * Example of Tap to select
 */
var tapCallback = function(gesture, frame){
	var cords = app.get('motion').leapToScene(frame, gesture.position, $(window).width(), $(window).height());

	setTimeout(function(){
		var element = document.elementFromPoint( ( cords[0] + 44), (cords[1] + 44));

		// console.log(cords[0] + 44, cords[1] + 44);

		var old = 1;

		// console.log(element);

		if( $(element).prop('tagName') !== 'HTML' || $(element).prop('tagName') !== 'BODY' ){

			$(element).css('-webkit-transform','scale(0.9)');
			setTimeout(function(){
				$(element).css('-webkit-transform','scale(1)');
			},400);
		}

	},200);
};


var swipeCallback = function(gesture, frame){

	if(gesture.progress > 1 && gesture.radius < 25){
		console.log('Listening....', gesture);
		app.get('speech').start();
	}

};

/**
 *Scrolling callback
 * @param  {[type]} frame   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
var scrollCallback = function(frame, options){
	var pos = frame.pointables[0].stabilizedTipPosition;
	if(options.lastFrame.pointables.length > 0){
		var delta = pos[1] - options.lastFrame.pointables[0].stabilizedTipPosition[1];

		if( frame.hands[0] && frame.hands[0].palmVelocity ){
			fingerTipElement.className = 'tip scroll';
			// console.log(frame);
			// $(window).scrollTop( $(window).scrollTop() + delta );
			var veloc = Math.abs(frame.hands[0].palmVelocity[1]);
			// console.log(veloc);
			// window.scrollBy(0,delta);
			var offset = ( $('.page-wrap').scrollTop() + (delta * (veloc / 100) ) );
			// console.log(offset);
			//
			$('.page-wrap').scrollTop( offset );
		}
		//
	}
};

if( !Modernizr.touch ){
	app.get('motion').attachEvents({
		'1fingers': fingerCallback,
		'screenTap': tapCallback,
		'3fingers': backgroundCallback,
		'5fingers': scrollCallback
	});
}
