(function(){

	var backgroundComponent = function(){

		var componentElement = $('.canvas');

		var detect = function(){
			return $('.homepage').length > 0;
		};

		var eneable = function(){
			attachEvents();
			console.log('enabled background!');
		};

		var init = function(){
			detect() && eneable();

			// $('.page-wrap').append('<div id="bgd" class="canvas"></div>');

			var s = Snap("#landing");
			Snap.load("/images/new_background-project.svg", function (f) {

		    var g = f.select("#phone");
		    var circleline = f.select("#line01_circle");
		    var circle = f.select("#line01");

		    g.attr('stroke-dasharray', 1000);
		    g.attr('stroke-dashoffset', 0);

		    var anims = [];
		    var dd = {};

		    var bob = function(element, limit){
		    	// console.log(element);
		    	if(element){
			    	element.attr('stroke-dashoffset', 0);
				    return element.animate({'stroke-dashoffset': limit}, 2000, function(){

				    	return bob(element, limit);
				    	// console.log('after');
				    });
		    	}
		    	// console.log('nope');

		    	return ;
		    };

		    var dispatch = function(obj, length, duration){
		    	if(obj){
		    		return setTimeout(function(){
					    obj.attr('stroke-dasharray', 200);
					    obj.attr('stroke-dashoffset', 0);

					    // setTimeout(function(){
					    anims.push( bob( obj, length));
		    		}, duration);
		    	}

		    };

		    for(var i=1; i < 12; i++){
		    	dd['item'+i] = f.select("#icon"+i);
		    	if(dd['item'+i]){
		    		dispatch(dd['item'+i], 1000, (i*400));
		    	}
		    }

		    setTimeout(function(){
		    	if(circleline){
				    circleline.attr('stroke-dasharray', 1000);
				    circleline.attr('stroke-dashoffset', 0);

				    anims.push(bob(circleline, 2000));
		    	}
		    },1000);

		    setTimeout(function(){
			    circle.attr('stroke-dasharray', 300);
			    circle.attr('stroke-dashoffset', 0);

			    anims.push(bob(circle, 2000));
		    },200);

		    anims.push(bob(g, 3000));

		    s.append(f);
		});
		};

		var attachEvents = function(){

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

	app.register('background', backgroundComponent);
})(jQuery, Modernizr, app);
