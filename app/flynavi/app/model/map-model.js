/**
 network service module
 @class MapModel.Constant
 **/
$.Model('MapModel.Constant', {
    defaults: {
        SHARE_POS_METRIC: 33,
        //            grey, green, yellow, red
        pathColor: ['#999', '#32ca2e', '#ffa800', '#e9350b']
    }
}, {
    init: function () {

    },
//    todo to extract controller method
    recoverEleState: function () {
        $('#tabsContent tbody').remove();
        $('#route').css('visibility', 'hidden');
        $('#zoom_in, #zoom_out').css({top: ''});
        $('#positioning').css('visibility', 'visible');
        $("#path_info").css('visibility', 'hidden');
        $('#tmc_btn').show();
        $('#navi').show();
        navInfo.restorationIni();
        navInfo.showProgressBar();
        navControl.showAinav();
    }
});

/**
 地图操作类
 @class  mapHandler
 @extends MapModel.mapHandler
 * */
$.Model('MapModel.mapHandler', {
    defaults: {
        zooms: [3, 17],
        iniZoom: 16,
//todo setContent method no implemented, so no customize the infoWindow offset, reference to http://api.amap.com/Javascript/guide#overlay
        infoOffsetHorizon: 37,
        infoOffsetVertical: 68,
        arrowWidth: 25,
        arrowHeight: 12,
        strAddressMaxLen: 12,
        strNameMaxLength: 6,
        tmcLayerId: 'traffic_layer',
        shareInfo: {},
        curInfo: {},
        curDisplayPath: 4,
        northUp: true,
        gpsState: true,
        updateOverlays: false,
        shareTitle: "飞享位置"
    }
}, {

    init: function () {
        this.zoom_in = $('#zoom_in');
        this.zoom_out = $('#zoom_out');
        this.mapObj = null;
    },
    /**
     The method to set polyline order
     @method setPathPileOrder.
     @param type number
     **/
    setPathPileOrder: function (type) {
        if (drawPath.lines0.length == 0) {
            return;
        }
        drawPath.removePolylines();
        drawPath.drawPath();
    },
    promptUser: function (id) {
        util_common.promptUser(id);
    },
    getNoGps: function () {
        var id = 'no_get_gps';
        this.promptUser(id);
    },
    getNoPath: function () {
        var id = 'no_get_path';
        this.promptUser(id);
    },


    getShareLngLat: function () {
        var lng = this.shareInfo.lng,
            lat = this.shareInfo.lat;
        return {lng: lng, lat: lat};
    },
    showMap: function () {
        var _ret = this.getShareLngLat();
        this.generateMap(_ret);
    },
    changeCenterWhenZoomchange: function () {
        var mapObj = mapHandler.mapObj;
        if (location.hash == '#share') {
            mapObj.panTo(new AMap.LngLat(mapHandler.shareInfo.lng, mapHandler.shareInfo.lat));
        }
    },
    moveMapCenter: function () {
        this.changeCenterWhenZoomchange();
    },

    setMapPathFit: function () {
        var lngLat = {
            maxlng: Math.max(drawPath.getTmcData().maxLng, drawPath.getNormalData().maxLng, mapHandler.curInfo.lng, mapHandler.shareInfo.lng),
            maxlat: Math.max(drawPath.getTmcData().maxLat, drawPath.getNormalData().maxLat, mapHandler.curInfo.lat, mapHandler.shareInfo.lat),
            minlng: Math.min(drawPath.getTmcData().minLng, drawPath.getNormalData().minLng, mapHandler.curInfo.lng, mapHandler.shareInfo.lng),
            minlat: Math.min(drawPath.getTmcData().minLat, drawPath.getNormalData().minLat, mapHandler.curInfo.lat, mapHandler.shareInfo.lat)
        }
        var that = this;
        this.setPathFitView(function () {
            scale.attr('level', that.getZoom());
        }, lngLat);
    },
    setPathBounds: function (maxlng, maxlat, minlng, minlat, mapSpan, zoomOffset) {
        var southWest = new AMap.LngLat(maxlng, maxlat),
            northEast = new AMap.LngLat(minlng, minlat - mapSpan),
            bounds = new AMap.Bounds(southWest, northEast);
        this.mapObj.setBounds(bounds, zoomOffset);
    },
    hasGps: function () {
        return this.gpsState;
    },
    handleGpsState: function () {
        if (!mapHandler.hasGps()) {
            mapHandler.gpsState = true;
        }
    },
    changeState: function () {
        this.attr('gpsState', false);
    },
    addShareInfoWindow: function (lng, lat) {
        var strNameMaxLength = this.strNameMaxLength;
        var name = util_common.truncateStr(this.shareInfo.name, strNameMaxLength),
            address = '';

        if (this.shareInfo.address) {
            var maxLength = this.strAddressMaxLen;
            address = util_common.truncateStr(this.shareInfo.address, maxLength);
        }
        var info = this.buildInfowindowStr(name, address);
        var info = {
            isCustom: true,
            content: info,
            offset: new AMap.Pixel(this.infoOffsetHorizon, -this.infoOffsetVertical)
        };
        this.generateInfoWindow(info);
        this.infoPos = this.generateLngLat(lng, lat);
        /*this.openInfoWin();*/
        var that = this;
        this.mapObj.bind(this.inforWindow, 'open', function () {
            that.enableDragInfoWin.call(that);
        });
    },

    recoverMapState: function () {
        var mapObj = this.mapObj;
        mapObj.panTo(new AMap.LngLat(mapHandler.shareInfo.lng, mapHandler.shareInfo.lat));
        requestPath.recoverRequestState();
        mapObj.removeOverlays(['start_pos', 'end_pos']);
        drawPath.removePolylines();
        this.toggleMarker(true);
        this.attr('curDisplayPath', 4);
    },
    getDistance: function (end, start) {
        try {
            return this.mapObj.getDistance(new AMap.LngLat(end.lng, end.lat), new AMap.LngLat(start.lng, start.lat))
        } catch (e) {
            console.log(e)
        }
    },
    getSectionNodeCoord: function (prev, next, lenToPrev, len) {
        if (typeof prev === 'undefined') {
            prev = this.curInfo;
        }
        var prevLng = Number(prev.lng),
            prevLat = Number(prev.lat),
            nextLng = Number(next.lng),
            nextLat = Number(next.lat);
        var tempX = nextLng - prevLng,
            tempY = nextLat - prevLat;
        var lng = prevLng + (tempX * (lenToPrev / len)),
            lat = prevLat + (tempY * (lenToPrev / len));
        return new AMap.LngLat(lng, lat);
    }
});
/*
 *   poll gps
 *   @class  DevPosTracker
 *   @constructor
 * */
$.Model('DevPosTracker', {
        defaults: {
            currGPS: null,
            lastGPS: null,
            isPollGps: false,
            /**
             * @constant 轮询gps信息的参数设置
             * @default WatchGPS类的类属性，默认值
             */
            argPollGps: {
                enableHighAccuracy: false,
                /**
                 @description 1秒获取一个GPS点
                 */
                timeout: 1000,
                /**
                 @description 无条件重新获取GPS位置
                 */
                maximumAge: 0
            },
            errMsg: {
                '1': "位置服务被拒绝。",
                '2': "暂时获取不到位置信息。",
                '3': "获取信息超时。",
                'default': "未知错误。"
            }
        }
    },
    {
        init: function (config) {
            if (typeof config === 'undefined') {
                return;
            }
            this.callbackDisconnectGps = config.callbackDisconnectGps;
            this.tbt = config.tbt;
            var that = this;
            this.onSuccess = function (position) {
//                this.currGPS = position
                config.successCallback.call(that, position);
            };
            this.onError = function (error) {
                if (that.lastGPS == null) {
                    that.callbackDisconnectGps();
                    return;
                }
                that.currGPS = that.lastGPS;
                config.failCallback(error);
            };
        },
        generateGPS: function (position) {
            var gpsInfo = {};
            gpsInfo.longitude = position.coords.longitude;
            gpsInfo.latitude = position.coords.latitude;
            gpsInfo.speed = position.coords.speed * 3.6; //速度单位从m/s转换到km/h
            gpsInfo.direction = position.coords.heading;
            var date = new Date();
            date.setTime(position.timestamp);
            gpsInfo.year = date.getFullYear();
            gpsInfo.month = date.getMonth() + 1;
            gpsInfo.day = date.getDate();
            gpsInfo.hour = date.getHours();
            gpsInfo.minute = date.getMinutes();
            gpsInfo.second = date.getSeconds();
            return gpsInfo;

        },
        getCurrIniGps: function () {
            return {
                lng: this.currGPS.coords.longitude,
                lat: this.currGPS.coords.latitude
            };
        },
        getCurrEncapsulatedGps: function () {
            return this.currGPS;
        },

        getCurrGps: function (lngLat, position) {
            return  this.encapsulateGps(lngLat, position);
        },
        setCurrGpsNull: function () {
            this.currGPS = null;
        },
        encapsulateGps: function (lngLat, currGPS) {
            var position = currGPS;
            position.coords.longitude = lngLat.lng;
            position.coords.latitude = lngLat.lat;
            this.currGPS = this.generateGPS(position);
            this.lastGPS = this.currGPS;
            return this.currGPS;
        },
        handle_position: function (position) {
            var config = {
                lng: position.coords.longitude,
                lat: position.coords.latitude,
                altitude: position.coords.altitude
            };
        },

        pollGps: function () {
            var that = this;
            if (navigator.geolocation) {
                var watchGPS = navigator.geolocation.watchPosition(function (position) {
                    that.onSuccess(position);
                }, that.onError, that.argPollGps);
            }
            else {
                that.callbackDisconnectGps();
            }

            return watchGPS;
        }
    });
$.Model('MapModel.Scale', {
    defaults: {
        level: 0,
        maxLevel: 17,
        minLevel: 3
    }
}, {
    setLevel: function (newLevel) {
        return  newLevel == 2 || newLevel == 18 ? this.level : newLevel;
    },
    isScale: function () {
        return this.level <= this.maxLevel && this.level >= this.minLevel;
    },
    isMaxScale: function () {
        return this.level == 17;
    },
    isMinScale: function () {
        return this.level == 3;
    },
    updateMarker: function () {
        mapHandler.toggleMarker(false);
        var configStart = {
            lng: mapHandler.curInfo.lng,
            lat: mapHandler.curInfo.lat,
            id: 'start_pos',
            imgAddress: 'flynavi/resources/images/start_point.png',
            imgWidth: 41,
            imgHeight: 36
        }, configEnd = {
            lng: mapHandler.shareInfo.lng,
            lat: mapHandler.shareInfo.lat,
            id: 'end_pos',
            imgAddress: 'flynavi/resources/images/end_point.png',
            imgWidth: 41,
            imgHeight: 36
        };
        mapHandler.startMarker = mapHandler.addMarker(configStart);
        mapHandler.endMarker = mapHandler.addMarker(configEnd);
    }
});

$.Model('MapModel.ToggleEleState', {
        defaults: {
            SHARE_POS_METRIC: 33
        }
    }, {
        init: function () {

        },
        toggleEleAfterRequest: function () {
            $('.toolbar:first').css('visibility', 'visible');
            $('#positioning').css('visibility', 'hidden');
        }
    }
);