/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 5/29/13
 * Time: 11:31 AM
 * Modified:   2013-6-27
 * Use:
 */
define(['historyController', 'controllerMap', 'cache', 'mapHandler', 'map', 'tab', 'link', 'networkDetect', 'toolBar', 'route', 'toolsFlynavi'], function () {
    var netService = new MapModel.netService();
    if (!netService.isConnected()) {
        netService.promptNoNet();
        return false;
    }
    util_common = new Util.common();
    var url = location.href.replace(/#.*$/, '');
    var parseUrl = util_common.parseUrl(url);

    publicModel = new PublicModel();
    scale = new MapModel.Scale();
    mapHandler = new MapModel.mapHandler();
    common = new MapModel.Constant();
    eleToggle = new MapModel.ToggleEleState()
    requestPath = new MapModel.RouteRequestFrame({
        callback: function () {
            location.hash = '#requestPath';
            var that = this;
            var tmcRouteLen = this.getRouteLength(4),
                normalRouteLen = this.getRouteLength(0),
                tmcRouteTraffic = that.getSomeLenRouteTraffic(4),
                normalRouteTraffic = that.getSomeLenRouteTraffic(0);
            var config = {
                tmcRouteLength: tmcRouteLen,
                tmcTime: that.getRouteTime(4),
                normalRouteLength: normalRouteLen,
                normalTime: that.getRouteTime(0),
                arrTmcTraffic: tmcRouteTraffic,
                arrNormalTraffic: normalRouteTraffic,
                arrTrafficCol: common.pathColor
            };
            require(['mapRouteView'],function(){

                setMapRouteView = new MapRouteView(config);
                setMapRouteView.displayData();
                require(['pathDrawing'], function () {
                    drawPath = new MapModel.PathDrawing({
                        mapObj: mapHandler.mapObj,
                        rapidInfo: that.getRapidPathInfo(),
                        normalInfo: that.getNormalPathInfo(),
                        tmcRouteTraffic: tmcRouteTraffic,
                        normalRouteTraffic: normalRouteTraffic,
                        pathColor: common.pathColor
                    });
                    drawPath.drawPath();
                    mapHandler.setMapPathFit();
                })
            })
            require(['raxtoneServer'], function () {
                requestRaxtone = new MapModel.netServiceRaxtone({
                    loginErrorCallback: navInfo.failMethod,
                    notSupportPrediction: navInfo.showNotSupportPrediction
                });
                requestRaxtone
                    .bind('sid', function (ev, newVal) {
                        this.requestRaxtoneRoutePre(newVal, 4, navInfo.requestTmcFail);
                    })
                    .bind('dataPrediction', function (ev, newVal) {
                        /**
                         bind handler if get prediction data

                         @param newVal {Object}
                         @example
                         Object {requestTime: 1374124220041, timeExtend10: 1490, timeExtend20: 1490}
                         get seconds: (new Date(1374124220041)).getSeconds()
                         get request type: this.getPlanType()
                         **/
//                        var newVal = {requestTime: 1374124220041, timeExtend10: 1490, timeExtend20: 1490};
                        if (this.getPlanType() == 4) {
                            navInfo.showTmcData(newVal);
                            var sid = requestRaxtone.getSid();
                            requestRaxtone.requestRaxtoneRoutePre(sid, 0, navInfo.requestNormalFail)
                        } else {
                            navInfo.showNormalData(newVal);
                        }
                    });
                requestRaxtone.requestRaxtoneLogin();
            })
            require(['controlNav', 'controlBar' ], function () {
                var toolbarNav = new ToolbarNav('.e-inav', {
                    mapHandle: mapHandler,
                    routeObj: routeObj
                }), arr = [];
                arr.push($('#link_bar').height());
                arr.push($('#route .header').height());
                arr.push($('#tabsContent thead:first').height());
                arr.push($('#route .route_info').height());
                toolbarNav.setScrollEleHeight(arr);
                if (typeof navControl == 'undefined') {
                    navControl = new NavControl($('#header'), {toolbarNav: toolbarNav});
                }
                navControl.showCinav();
            })
            scale.updateMarker();
            eleToggle.toggleEleAfterRequest();
            requestPath.toggleLoadingEffect();
        },
        failCallback: function () {
            requestPath.toggleLoadingEffect();
            this.attr('isRequestPath', false);
            if (!netService.isConnected()) {
                var id = 'no_get_net';
                util_common.promptUser(id);
                return;
            }
            //            todo ui toggle and param modification should seperate
            mapHandler.getNoPath();
        }
    });
    followDev = new DevPosTracker({
        successCallback: function (currGps) {
            var that = this;
//            var lngLat = this.getCurrIniGps();
            var lngLat={
                lng:currGps.coords.longitude,
                lat:currGps.coords.latitude
            };
            if (publicModel.isIOS()) {
                mapHandler.correctPosition(lngLat.lng, lngLat.lat, rectifyDeviation);
            } else {
                rectifyDeviation({
                    lng: lngLat.lng,
                    lat: lngLat.lat
                });
            }
            function rectifyDeviation(lngLat) {
                var currGPS = that.getCurrGps.call(that,lngLat,currGps);
                requestPath.attr('iGpsCount', requestPath.iGpsCount++);
                mapHandler.attr('curInfo', {
                    lng: currGPS.longitude,
                    lat: currGPS.latitude,
                    angle: currGPS.direction
                });
                that.setCurrGpsNull.call(that);
            }

            mapHandler.handleGpsState();
        },
        failCallback: function (err) {
            requestPath.attr('iGpsCount', this.iGpsCount++);
        },
        callbackDisconnectGps: function () {
            //            todo specify gps
            //            requestPath.setCurPos();
            mapHandler.changeState();
        },
        tbt: requestPath.tbt
    });
    (new Link($('.info'), {isIOS: publicModel.isIOS()})).setUrl();
    var mapController = new MapControl($('#mask_layer'));
    scale
        .bind('level', function (ev, newVal) {
//            todo     高德回复：目前在手机浏览器上的支持情况还不是特别理想。
//            to recovery if map's center change after scale but moveMapCenter to change for different conditions
         /*   mapHandler.moveMapCenter()*/
            if (scale.isScale()) {
                mapHandler.mapObj.setZoom(newVal);
            }
            mapController.setZoomBtnUi();
        });

    requestPath
        .bind('isRequestPath', function (ev, newItems) {
            if (!newItems) {
                return;
            }
            var start = {
                    x: mapHandler.curInfo.lng,
                    y: mapHandler.curInfo.lat
                },
                end = {
                    x: mapHandler.getShareLngLat().lng,
                    y: mapHandler.getShareLngLat().lat
                };
            this.startRequest(start, end);
        })
        .bind('iGpsCount', function () {
            this.setGpsInfo(followDev.getCurrEncapsulatedGps());
        });
    followDev.bind('isPollGps', function () {
        this.pollGps();
    });
    bindFocusEve = function (eleExclude) {
        $("*:not(" + eleExclude + ")").focus(function () {
            this.blur();
        });
    }
    return parseUrl
})