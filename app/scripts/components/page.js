
var width = $(window).width();
var height = $(window).height();

window.tt = null;

window.clickedElement = false;

/**
 * Example of 1 finger hover
 */
var fingerTipElement = document.querySelector('.tip');

var fingerCallback = function(frame){

	if(frame.fingers[0]){
		fingerTipElement.className = 'tip';

		var pos = frame.fingers[0].stabilizedTipPosition;
		var poss = app.get('motion').leapToScene(frame, pos, width, height);

		var deltaX = poss[0] + 44;
		var deltaY = poss[1] + 44;

		window.mouseX = deltaX;
		window.mouseY = deltaY;

		fingerTipElement.style.left = deltaX + 'px';
		fingerTipElement.style.top = deltaY + 'px';

		var gammaX = Math.abs(frame.fingers[0].tipVelocity[0]);
		var gammaY = Math.abs(frame.fingers[0].tipVelocity[1]);
		var gammaZ = Math.abs(frame.fingers[0].tipVelocity[2]);


		if(gammaX < 2 && gammaY < 2 && gammaZ < 2){

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
 * [swipeCallback description]
 * @param  {[type]} gesture [description]
 * @param  {[type]} frame   [description]
 * @return {[type]}         [description]
 */
var connectCallback = function(){

	$('html').addClass('motion');
	console.log('connected!');

};

var disconnectCallback = function(){

	$('html').removeClass('motion');
	console.log('disconnected!');

};

/**
 * Scrolling callback
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
			var veloc = Math.abs(frame.hands[0].palmVelocity[1]);
			var offset = ( $('.page-wrap').scrollTop() + (delta * (veloc / 100) ) );
			$('.page-wrap').scrollTop( offset );
		}

	}

	return ;
};

if( !Modernizr.touch ){
	app.get('motion').attachEvents({
		'1fingers': fingerCallback,
		'screenTap': tapCallback,
		'3fingers': backgroundCallback,
		'5fingers': scrollCallback,
		'deviceConnected': connectCallback,
		'deviceDisconnected': disconnectCallback
	});
}
