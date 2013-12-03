/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/3/13
 * Time: 2:44 PM
 * Use:
 */
define(['jquerymx'], function () {
    /**
     A utility that Navigation event controller
     @class Map
     @constructor
     **/
    $.Controller('Map', {
        /**
         Method for automatic call instantiated
         @method init.
         **/
        init: function () {
        },
        '#icon_request_path touchstart': function () {
            if (!mapHandler.hasGps()) {
                mapHandler.getNoGps();
                return;
            }
            if (mapHandler.curInfo.lng == mapHandler.shareInfo.lng && mapHandler.curInfo.lat == mapHandler.shareInfo.lat) {
                return;
            }
            requestPath.triggerRequestEvent();
        }
    });
    return Map;
})
