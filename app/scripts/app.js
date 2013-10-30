(function($) {
    window.components = {};
    window.views = {};

    /**
     * Components class convention
     */
    window.app = (function() {

        var init = function() {
            registerPageComponents();
            registerControllers();
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
                component.detect() && component.enable();
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
