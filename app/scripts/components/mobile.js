/**
 * Mobile component
 *
 * List of events
 *
 * 'tap .selector'
 */
(function(){

    var mobileComponent = function(){

        var options = {
            isEnabled: false,
            events: {}
        };

        var detect = function(){
            return Modernizr.touch;
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

        var init = function(data, optionsData){
            _.extend(options, optionsData);

            detect(data) && enable();
        };

        var attachEvents = function(data){
            if( options.isEnabled ){
                data && _.extend(options.events, data);

                $.each(options.events, function(key, eventBinding){
                     var type = key.split(' ');

                    $(type[1]).hammer(options.touchSettings).on(type[0], eventBinding);
                });
                return true;
            }
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
            'detect': detect,
            'enable': enable,
            'disable': disable,
            'attachEvents': attachEvents
        };
    };

    app.register('mobile', mobileComponent);

})(app, jQuery, Modernizr, Hammer);
