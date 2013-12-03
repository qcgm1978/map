/**
 * Created with JetBrains WebStorm.
 * User: mac
 * Date: 13-1-13
 * Time: 下午9:25
 * To change this template use File | Settings | File Templates.
 */
define(['jquerymx'], function () {
    /**
     A utility that public model
     @class PublicModel
     @constructor
     **/
    $.Class('PublicModel', {
        /**
         The method is Determine whether the mobile device
         @method isMobileDev.
         @return {Boolean}
         **/
        isMobileDev: function () {
            var u = navigator.userAgent;
            return  /AppleWebKit.*Mobile/.test(u);
        },
        /**
         The method is Determine whether the ios device
         @method isIOS.
         @return {Boolean}
         **/
        isIOS: function () {
            return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
        },
        /**
         The method is Determine whether the qq browser
         @method isQqBrowser.
         @return {Boolean}
         **/
        isQqBrowser: function () {
            return /QQBrowser/i.test(navigator.userAgent);
        },
        isNativeBrowserOfLenovo:function(){
          return /Lenovo/i.test(navigator.userAgent)
        },
        getOrientationProp: function () {
            var supportsOrientationChange = "onorientationchange" in window;
            var orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
            return orientationEvent;
        },
        // Simple JavaScript Templating
// by John Resig - http://ejohn.org/ - MIT Licensed
        /**
         The method is build string by tmpl
         @method buildEleStrByTmpl.
         @return {Function}
         **/
        buildEleStrByTmpl: function (str, data) {
            var cache = {};

            return (function template(str, data) {
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = !/\W/.test(str) ?
                    cache[str] = cache[str] ||
                        template(document.getElementById(str).innerHTML) :

                    // Generate a reusable function that will serve as a template
                    // generator (and which will be cached).
                    new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +

                            // Introduce the data as local variables using with(){}
                            "with(obj){p.push('" +

                            // Convert the template into pure JavaScript
                            str
                                .replace(/[\r\t\n]/g, " ")
                                .split("<%").join("\t")
                                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                                .replace(/\t=(.*?)%>/g, "',$1,'")
                                .split("\t").join("');")
                                .split("%>").join("p.push('")
                                .split("\r").join("\\'")
                            + "');}return p.join('');");

                // Provide some basic currying to the user
                return data ? fn(data) : fn;
            })(str, data);
        }
    });
    return PublicModel

});