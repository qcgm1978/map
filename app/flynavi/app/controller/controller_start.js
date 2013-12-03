/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 1/11/13
 * Time: 7:04 PM
 * Use:
 */
/*todo 调试相关：
 *  localStorage['flyway_info']
 *  mapHandler.attr('curInfo', {
 lng:0,
 lat:0
 });
 mapHandler.curMarker.setVisible(true)
 requestPath.pushGPSLogLatLon()
 mapHandler.mapObj.setZoom(10)
 * */
define(['jquerymx'], function () {
    $.Controller('MapControl', {
        init: function () {
        },
        '#positioning touchstart': function (el) {
            el.addClass('active');
            if (!mapHandler.gpsState) {
                mapHandler.getNoGps();
                return;
            }
            mapHandler.mapObj.panTo(new AMap.LngLat(mapHandler.curInfo.lng, mapHandler.curInfo.lat));
        },
        '#positioning touchend': function (el) {
            el.removeClass('active');
        },
        '#positioning touchmove': function (el) {
            el.trigger('touchend');
        },
        '#positionLight touchstart': function () {
            mapHandler.getNoGps();
        },
        '#zoom_in touchstart': function (el) {
            if (!el.hasClass('gray')) {
                el.addClass('active');
            }
        },
        '#zoom_in touchmove': function (el) {
            el.trigger('touchend');
        },
        '#zoom_in touchend': function () {
            if (!scale.isMaxScale()) {
                var level = scale.level ? scale.level + 1 : mapHandler.mapObj.getZoom() + 1;
                scale.attr('level', level);
            }
        },
        '#zoom_out touchstart': function (el) {
            if (!el.hasClass('gray')) {
                el.addClass('active');
            }
        },
        '#zoom_out touchend': function () {
            if (!scale.isMinScale()) {
                var level = scale.level ? scale.level - 1 : mapHandler.mapObj.getZoom() - 1;
                scale.attr('level', level);
            }
        },
        '#zoom_out touchmove': function (el) {
            el.trigger('touchend');
        } ,
        setZoomBtnUi:function() {
            if (scale.isMaxScale()) {
                mapHandler.zoom_in.removeClass('active').addClass('gray');
            } else {
                mapHandler.zoom_in.removeClass('active');
                if (mapHandler.zoom_in.hasClass('gray')) {
                    mapHandler.zoom_in.removeClass('gray');
                }
            }
            if (scale.isMinScale()) {
                mapHandler.zoom_out.removeClass('active').addClass('gray');
            } else {
                mapHandler.zoom_out.removeClass('active');
                if (mapHandler.zoom_out.hasClass('gray')) {
                    mapHandler.zoom_out.removeClass('gray');
                }
            }
        }
    });
});
