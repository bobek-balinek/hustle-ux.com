(function(){

	$(document).ready(function(){
		$('.devices .motion').on('click', function(event){
			event.preventDefault();
			$('.top-bar').toggleClass('open');
			$(this).toggleClass('active');
		});
	});

})(jQuery, Modernizr, window);
