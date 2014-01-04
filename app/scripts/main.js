(function(){

	$(document).ready(function(){

	});

	/**
	 * Initialise FastClick
	 */
	window.addEventListener('load', function() {
    FastClick.attach(document.body);
	}, false);

})(jQuery, Modernizr, FastClick, window);

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = angleInDegrees * Math.PI / 180.0;
  var x = centerX + radius * Math.cos(angleInRadians);
  var y = centerY + radius * Math.sin(angleInRadians);
  return [x,y];
}

function describeArc(x, y, radius, startAngle, endAngle){

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  // position from the y - radius
  var d = [
      "M", start[0], start[0],
      "A", radius, radius, 0, arcSweep, 0, end[0], end[0]
  ].join(" ");

  return d;
}
