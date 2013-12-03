/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/3/13
 * Time: 4:02 PM
 * Use:
 */
define(['jquerymx'],function(){
    /**
     A utility that PathInfo event controller
     @class PathInfo
     @constructor
     **/
    $.Controller('PathInfo', {
            /**
             * PathInfo property description.
             * @property  ""
             * * @type {Object}
             * @default ""
             */
            defaults: {

            }
        },
        {
            /**
             Method for automatic call instantiated
             @method init.
             **/
            init: function () {

            },
            /**
             Method for switching path selected
             @method togglePath.
             **/
            togglePath: function () {
                if ($(this).hasClass('route_selected')) {
                    return;
                }
                $('#route_tmc,#route_normal')
                    .toggleClass('route_selected')
                    .toggleClass('route_unselected');
                mapHandler.curDisplayPath = $(this).attr('data-theme');
                mapHandler.setPathPileOrder();
            },
            '#route_tmc  click': function (el, ev) {
                this.togglePath.call(el);
            },
            '#route_normal click': function (el, ev) {
                this.togglePath.call(el);
            }
        }
    );
    return PathInfo;
})
