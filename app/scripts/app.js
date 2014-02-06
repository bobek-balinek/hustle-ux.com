(function($) {
    'use strict';

    window.components = {};
    window.views = {};

    /**
     * Detect high res displays (Retina, HiDPI, etc...)
     */
    Modernizr.addTest('highresdisplay', function(){
        if (window.matchMedia) {
            var mq = window.matchMedia('only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)');
            if(mq && mq.matches) {
                return true;
            }
        }
    });

    /**
     * Components class convention
     */
    window.app = (function() {

        var init = function() {
            registerPageComponents();
        };

        var registerComponent = function(name, object) {
            window.components[name] = object();
            return getComponentElements(name);
        };

        var getComponent = function(name) {
            return window.components[name];
        };

        var getComponentElements = function(name) {
            return $('[data-component="' + name + '"]');
        };

        var registerPageComponents = function() {
            $.each(window.components, function (name, component) {
                if( component.detect() ){
                    component.enable();
                }
            });
        };

        return {
            'init': init,
            'get': getComponent,
            'register': registerComponent,
            'registerPageComponents': registerPageComponents
        };

    })();

})(jQuery);
