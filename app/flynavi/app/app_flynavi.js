/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 6/27/13
 * Time: 3:45 PM
 * Use:
 */
require.config({
    baseUrl: 'scripts',
    paths: {
        mapModel: '../flynavi/app/model/map-model',
        controllerMap: '../flynavi/app/controller/controller_start',
        navInfo: '../flynavi/app/controller/controller_naviInfo',
        toolsFlynavi: '../flynavi/app/util/tools_flynavi',
        jquery: '../bower_components/jquery/jquery',
        jquerymx: '../bower_components/jquerymx/jquerymx',
        fastdom: '../bower_components/fastdom/index',
        tools: "util/tools",
        mapUtil: "util/mapUtil",
        tbt: 'lib/tbt',
        toolBar: 'controller/Toolbar',
        cache: 'util/cache',
        map: 'controller/Map',
        mapHandler: 'model/mapHandler',
        webRoute: 'lib/webroute',
        iScroll: '../bower_components/iScroll4.2.5/iscroll',
        app: 'app',
        tab: 'controller/Tab',
        link: 'controller/Link',
        pathDrawing: 'model/pathDrawing',
        route: 'model/routeInfo',
        mapRouteView: '../flynavi/app/model/route-view',
        networkDetect: 'model/networkCommunication',
        historyController: 'controller/historyController',
        trafficLayer: '../flynavi/app/controller/controller_maskerlayer',
        raxtoneServer: '../flynavi/app/model/networkCommunication-raxtone',
        controlNav: '../flynavi/app/controller/controller_navControl',
        controlBar: '../flynavi/app/controller/controller_toolbar',
        appFlyNavi: '../flynavi/app/app_flynavi'  ,
        sharePath:'../flynavi/app/controller/share-path'
    },
    shim: {
        mapModel: {
            deps: [ 'mapUtil', 'iScroll', 'tbt']
        },
        toolsFlynavi: {
            deps: ['tools']
        },
        jquerymx: {
//            change jquery dependency to  jqueryMigrate if needed
            deps: ['jquery']
        },
        toolBar: {
            deps: ['tools']
        },
        mapHandler: {
            deps: ['jquerymx', 'mapModel']
        },
        tbt: {
            deps: ['jquerymx', 'webRoute']
        }
    }
});

/**
 @param {Boolean|Null|Object} appRet
 the ret val of app module. false if no network connection, null if no shared data, object if shared data exists
 **/
require(['app', 'navInfo', 'trafficLayer'], function (appRet) {
    if (!appRet) {
        return;
    }
//todo loaded module generate global var so requireJs hasn't effect on avoiding global var
    mapHandler
        .bind('shareInfo', function (ev, newVal) {
            if (newVal == null) {
                return;
            }
            var configShare = {
                lng: this.getShareLngLat().lng,
                lat: this.getShareLngLat().lat,
                imgAddress: 'flynavi/resources/images/share_position.png',
                imgWidth: 53,
                imgHeight: 41
            };
            var height = $('body').height() - $('#header').height() - $('#link_bar').height();
            $('#map_container').height(height);
            this.showMap();
            this.shareMarker = this.addMarker(configShare);
            //this.addShareInfoWindow(this.getShareLngLat().lng, this.getShareLngLat().lat);
            $('#share_name').text('(' + util_common.truncateStr(mapHandler.shareInfo.name, 20) + ')');
            $('#share_address').text(mapHandler.shareInfo.address);
            this.handleZoomChangeEve(function () {
                scale.attr('level', mapHandler.mapObj.getZoom());
            });
        })
        .bind('curInfo', function (ev, newVal) {
            if (this.mapObj == null) {
                return;
            }
            require(['sharePath'])
            if (this.mapObj && this.curMarker) {
                this.moveCurMarker();
            }
            else {
                var configCur = {
                    lng: this.curInfo.lng,
                    lat: this.curInfo.lat,
                    imgAddress: 'images/cur_position.png',
                    imgWidth: common.SHARE_POS_METRIC,
                    imgHeight: common.SHARE_POS_METRIC
                };
                this.curMarker = this.addMarker(configCur);
            }
            this.rotateCurMarkerOrMap();
        });
    bodyLoad();
    mapHandler.attr('shareInfo', appRet);
    //加载完body元素后切换启动页
    function bodyLoad() {
        $('#main').css('display', 'block');
        $('#start').css('display', 'none');
        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 100);
    }

    bindFocusEve();
    location.hash = '#share';
    //定位按钮等待状态
    var position_interval = null;
    void function () {
        var num = 0
        if (/Android\s*2\.3/.exec(navigator.userAgent)) {
            $('#positionLight').css('-webkit-backface-visibility', 'visible');
            $('#path_info .prediction_model,#path_info .route_normal_container').css('-webkit-backface-visibility', 'visible')
            $('#navi').css('-webkit-backface-visibility', 'visible');
        }
        position_interval = setInterval(function () {
            /*填加自车位置后，隐藏正在定位按钮样式*/
            if (mapHandler.mapObj && mapHandler.curMarker) {
                positionStateEnd();
            }
            var angle = 45 * num;
            num++;
            $('#positionLight').css({
                '-webkit-Transform': 'rotate(' + angle + 'deg)'
            }, 200)
            if (num == 8) {
                num = 0;
            }
        }, 150);
    }();
    function positionStateEnd() {
        clearInterval(position_interval);
        $('#positionLight').removeClass('loading').hide();
    }

    new Map($('#navi'));
    navInfo = new NaviInfo($('#path_info'));
    var config = {
        unit: '千米/小时',
        arrTrafficCol: common.pathColor
    };
    routeObj = new Route(config);
    routeObj.attr('totalWidth', ($(document.body).width() - $('.tabsContent_table th').eq(0).width() - $('.tabsContent_table th').eq(2).width()) / 2);
    new Tab($('#route'), {routeObj: routeObj});
    $(window).fly_shared_history({
        routeObj: routeObj,
        toolbar: toolbar
    });

    new MaskLayer($('#mask_layer'));
    followDev.attr('isPollGps', true);
    if (/micromessenger/i.exec(navigator.userAgent)) {
        $.getScript('scripts/util/micro-share.js', function () {
            var contents = util_common.truncateStr(mapHandler.shareInfo.name) + '(' + mapHandler.shareInfo.address + ')';
            handleMicroMesseageSharing({
                contents: contents,
                img: "images/start-320-460.jpg"
            })
        })
    }

    return true;
})