/*
 * @class network service module
 * */

$.Model('MapModel.Constant', {
    defaults: {
        SHARE_POS_METRIC: 33
    }
}, {
    init: function () {

    },
    recoverEleState: function () {
        var $zoomOut = $('#zoom_out'), $zoomIn = $('#zoom_in'), $positioning = $('#positioning'), $pathInfo = $('#path_info'), bottomHeight = $pathInfo.height(), $poiDiv = $('#poi_div');
        $('.toolbar:first').css('visibility', 'hidden');
        $positioning.css('visibility', 'visible');
        $('#tabsContent tbody').remove();
        $('#route_tmc')
            .addClass('route_selected')
            .removeClass('route_unselected');
        $('#route_normal')
            .removeClass('route_selected')
            .addClass('route_unselected');
        $('#route').css('visibility', 'hidden');
        $poiDiv.css('visibility', 'visible');
        $('#search_box').show();
        if ($pathInfo.css('visibility') !== 'hidden') {
            if (!$poiDiv.hasClass('shrink')) {
                $zoomOut.css({'bottom': parseFloat($zoomOut.css('bottom')) - bottomHeight + $poiDiv.height()});
                $zoomIn.css({'bottom': parseFloat($zoomIn.css('bottom')) - bottomHeight + $poiDiv.height()});
                $positioning.css({'bottom': parseFloat($positioning.css('bottom')) - bottomHeight + $poiDiv.height()});
            } else {
                $zoomOut.css({'bottom': parseFloat($zoomOut.css('bottom')) - bottomHeight});
                $zoomIn.css({'bottom': parseFloat($zoomIn.css('bottom')) - bottomHeight});
                $positioning.css({'bottom': parseFloat($positioning.css('bottom')) - bottomHeight});
            }
            $pathInfo.css('visibility', 'hidden');
        }
    }
});

/*
 * @class 地图操作类
 * */

$.Model('MapModel.mapHandler', {
    defaults: {
        hasMap: false,
        zooms: [3, 18],
        iniZoom: 16,
        markerWidth: 35,
        markerHeight: 51,
        infoWinWidth: 160,
        infoWinHeight: 50,
        arrowWidth: 25,
        arrowHeight: 12,
        strAddressMaxLen: 7,
        strNameMaxLen: 6,
        tmcLayerId: 'traffic_layer',
        center: {},
        shareInfo: {},
        curInfo: null,
        curDisplayPath: 4,
        northUp: true,
        setCenter: false,
        updateOverlays: false,
        //        def val when no poi got
        defLngLat: {
            lng: 120.16326427459717,
            lat: 30.278822660156308
        }

    }
}, {

    init: function () {
        this.mapObj = null;
    },
    /**
     The method to set polyline order
     @method setPathPileOrder.
     @param type number
     **/
    setPathPileOrder: function (type) {
        if (this.mapObj.getOverlaysByType('polyline').length == 1) {
            return;
        }
        var overlays0 = this.mapObj.getOverlays('NGIRoute0'),
            overlays1 = this.mapObj.getOverlays('NGIRoute1');
        var pathNormal = overlays0.getPathAndLastLocationCode(),
            pathRapid = overlays1.getPathAndLastLocationCode();
        overlays1.setPath(pathNormal);
        overlays0.setPath(pathRapid);
////        todo setPath method not changes the layout of two overlays, but setOptions method does. updates next version
//        var optionsNormal=overlays0.getOptions(),
//            optionsRapid=overlays1.getOptions(),
//            colNormal=optionsNormal.strokeColor,
//            colRapid=optionsRapid.strokeColor;
//        optionsNormal.strokeColor=colRapid;
//        optionsRapid.strokeColor=colNormal;
//        overlays1.setOptions(optionsRapid);
//        overlays0.setOptions(optionsNormal);
    },
    addLoadMap: function (obj) {
        if (this.hasMap) {
            return;
        }
        this.center = obj;
        this.iniMapPage();
    },
    hasGps: function () {
        return  !$.isEmptyObject(this.curInfo)
    },
    handleGpsState: function () {

    },
    changeState: function () {
        this.attr('curInfo', {});
    },
    encapsulateShareInfo: function () {
        this.infoPos = this.generateLngLat(this.shareInfo.lng, this.shareInfo.lat);
    },

    //            set map's zoom to display all marker as cur_pos overlay no added
    displayAllMarkers: function () {
        this.setCenter = true;
        this.setFitView();
    },
    deletePoiMarkers: function () {
        var that = this;
        $.each(this.mapObj.getOverlaysByType('marker'), function (i, n) {
//            todo marker's id deprecated
            if (n.a.id == 'cur_pos') {
                return;
            }
            that.mapObj.removeOverlays(n.a.id)
        })
    },
    promptUser: function (id) {
        util_common.promptUser(id);
    },
    getNoGps: function () {
        var id = 'no_get_gps',
            obj = util_common.isMicroMessengerBrowser() ? {
                txt: '未检测到GPS,请点击右上方按钮后,选择在浏览器中打开',
                id: 'no_get_gps'
            } : {
                id: 'no_get_gps_other_browser',
                txt: "请确保你的GPS打开，<br>且允许网页使用你的当前位置！"
            }
        $('#' + obj.id).html(obj.txt)
        this.promptUser(obj.id);
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
    iniMapPage: function () {
        this.showMap();
//    todo    to verify, delete repeatitive zoomchange event binding
//        this.bindZoomChangeEve();
        this.displayMapEle();
    },
    showMap: function () {
        var _ret = this.center;
        this.generateMap(_ret);
        this.attr('hasMap', true)
    },

    bindZoomChangeEve: function () {
        var mapObj = this.mapObj,
            bool = true,
            that = this;

        function zoomChangeHandler() {
            scale.attr('level', that.getZoom());
//        初始状态不干预弹出窗体显示事件
            if (!requestPath.isRequestPath) {
                if (that.setCenter) {
                    mapObj.panTo(that.infoPos);
                    this.setCenter = false;
                }
                return;
            }
//        规划路径状态关闭弹出窗体
            if (location.hash != '#share') {
                mapHandler.inforWindow.close();
                return;
            }
//        其他情况，（从规划路径状态返回）， 打开窗体并移动地图中心
            if (!mapHandler.inforWindow.getIsOpen()) {

            }
        }

        this.handleZoomChangeEve(zoomChangeHandler);
    },
    setMapPathFit: function () {
        mapHandler.iniZoom = this.getZoom();
//        setFitView not trigger zoomchange event
        this.setFitView();
        var zoom = this.getZoom();
        this.setZoom(zoom - 1 < 3 ? 3 : zoom - 1)
        return zoom;
    },
    //加载map后切换启动页
    displayMapEle: function () {
        $('#main').css('display', 'block');
        $('#start').css('display', 'none');
        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 100);
    },
    addCurMarker: function () {
        if (this.curMarker) {
            return;
        }
        var configCur = {
            lng: this.curInfo.lng,
            lat: this.curInfo.lat,
            id: 'cur_pos',
            imgAddress: 'images/cur_position.png',
            imgWidth: common.SHARE_POS_METRIC,
            imgHeight: common.SHARE_POS_METRIC
        };
        this.curMarker = this.addMarker(configCur);
    },

    addPoiMarker: function (config) {
        if (this.mapObj == null) {
            return;
        }
        var width = parseInt(this.markerWidth / 2);
        var height = this.markerHeight;
        var markerOption = {
            draggable: false,
            id: config.id,
            position: this.generateLngLat(config.lng, config.lat),
            zIndex: config.zIndex,
//            imgAddress: config.imgAddress,
            content: '<div id="poi_marker_' +
                config.order +
                '" ' +
                ' data-name=' +
                config.name +
                ' data-address=' +
                config.address +
                ' ></div>',
//            todo 300/2/2 - 12/2==69  but why? to test the algorithm
            offset: new AMap.Pixel(-width, -height)
        };
        var marker = this.generateMarkerObj(markerOption);
        this.addMarkerOverlay(marker)
    },
    changeNameAddressText: function (obj) {
        $('#share_name').text(obj.name)
        $('#share_address').text(obj.address)
    },
    getNameAddressTxt: function () {
        var name = util_common.truncateStr(this.shareInfo.name, this.strNameMaxLen),
            address = util_common.truncateStr(this.shareInfo.address, this.strAddressMaxLen);
        return {
            name: name,
            address: address
        }
    },
    setInfoWindowStyle: function (obj) {
        if ($.trim(obj.address) != '') {
            $('#col_first')
                .removeClass('tc')
                .addClass('tl');
            $('#share_p,#icon_request_path').addClass('address_twoline')
            return;
        }
        $('#col_first')
            .addClass('tc')
            .removeClass('tl')
        $('#share_p,#icon_request_path').removeClass('address_twoline')
    },
    changeInfoWindow: function (obj) {
//        todo api method reports error
//        var str = this.buildInfowindowStr(obj.name, obj.address);
//        this.inforWindow.setContent(str);
        var obj = this.getNameAddressTxt();
        this.changeNameAddressText(obj)
        this.setInfoWindowStyle(obj);
        this.inforWindow.setPosition(this.infoPos)
        this.setCurCenter();
    },
    addMultiPoiMarkers: function () {
        var that = this, str = 'abcdefghij';
        var obj = mapPoiIns.getPrevPage(mapPoiIns.curPage);
        if (typeof obj === 'undefined') {
            return;
        }
        var len = obj.length;
        $.each(obj, function (i, n) {
            var order = str.charAt(i);
            var configShare = {
                order: order,
                lng: n.x,
                lat: n.y,
//                todo marker's id deprecated
                id: 'share_pos' + '_' + order,
                zIndex: len - i,
                name: n.name,
                address: n.address
            };
            that.addPoiMarker(configShare);
        })
    },
    bindMarkerClick: function () {
        var mapObj = this.mapObj;
        var markers = mapObj.getOverlaysByType('marker'),
            that = this;
        $.each(markers, function (i, n) {
            var curMarker = n;
            mapObj.bind(curMarker, 'click', function (e) {
                if (poiListController.isAnimated()) return false;
                this.shareMarker = curMarker;
                var obj = {
                    lng: curMarker.getPosition().lng,
                    lat: curMarker.getPosition().lat,
                    name: $(curMarker.getContent()).data('name'),
                    address: $(curMarker.getContent()).data('address')
                }
                that.setInfoWindowAndCenter.call(that, obj);
            });
        })
    },
    handleMarkers: function () {
        this.deletePoiMarkers();
        this.addMultiPoiMarkers();
        this.displayAllMarkers();
        this.bindMarkerClick();
    },
    setCurCenter: function () {
        this.mapObj.panTo(this.infoPos)
    },
    setInfoWindowAndCenter: function (obj) {
        this.shareInfo = obj;
        this.encapsulateShareInfo();
        this.inforWindow ? this.changeInfoWindow(this.shareInfo) : this.addShareInfoWindow(this.shareInfo.lng, this.shareInfo.lat);
    },


    addShareInfoWindow: function (lng, lat) {
        var obj = this.getNameAddressTxt()
        var info = this.buildInfowindowStr(obj.name, obj.address);
        var $shareDiv = $('#share_div');
        var height = this.infoWinHeight;
        var infoWidth = this.infoWinWidth;
        var arrowWidth = this.arrowWidth;
        var info = {
            isCustom: true,
            content: info,
            offset: new AMap.Pixel(parseInt(infoWidth / 2) - parseInt(arrowWidth / 2), -height)
        };
        this.generateInfoWindow(info);
        this.infoPos = this.generateLngLat(lng, lat);
        this.openInfoWin();
        var that = this;
        this.mapObj.bind(this.inforWindow, 'open', function () {
            var obj = {
                address: $('#share_address').text()
            }
            that.setInfoWindowStyle.call(that, obj);
            that.enableDragInfoWin.call(that);
        });
    },
    recoverMapState: function () {
        var mapObj = this.mapObj;
        this.openInfoWin();
        mapObj.panTo(this.infoPos);
        requestPath.recoverRequestState();
        mapObj.removeOverlays(['start_pos', 'end_pos']);
        this.toggleMarker(true);
        this.attr('curDisplayPath', 4);
        drawPath.removePolylines();
    },
    addMultiOverlays: function (arr) {
        var that = this;
        $.each(arr, function (i, n) {
            var markerOption = {
                id: config.id,
                coord: that.generateLngLat(config.lng, config.lat),
                imgAddress: config.imgAddress,
                imgWidth: config.imgWidth,
                imgHeight: config.imgHeight
            };
            this.mapObj.addMarker();
        })
    }

});
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
                that.currGPS = that.generateGPS(position);
                config.successCallback(that.currGPS);
                that.lastGPS = that.currGPS;
                that.currGPS = null;
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
            var gpsinfo = {};
            gpsinfo.longitude = position.coords.longitude;
            gpsinfo.latitude = position.coords.latitude;
            gpsinfo.speed = position.coords.speed * 3.6; //速度单位从m/s转换到km/h
            gpsinfo.direction = position.coords.heading;
            var date = new Date();
            date.setTime(position.timestamp);
            gpsinfo.year = date.getFullYear();
            gpsinfo.month = date.getMonth() + 1;
            gpsinfo.day = date.getDate();
            gpsinfo.hour = date.getHours();
            gpsinfo.minute = date.getMinutes();
            gpsinfo.second = date.getSeconds();
            return gpsinfo;

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
//            if(util_common.isMicroMessengerBrowser() && !util_common.isIOS()) {
//                mapHandler.attr('curInfo', {});
//                return;
//            }
            if (navigator.geolocation) {
                var watchGPS = navigator.geolocation.watchPosition(function (position) {
                    that.onSuccess(position);
                }, that.onError, that.argPollGps);
            }
            else {
                that.callbackDisconnectGps();
            }
//            mapHandler.attr('curInfo', {});
            return watchGPS;
        }
    });
$.Model('MapModel.Scale', {
    defaults: {
        level: 0,
        maxLevel: 18,
        minLevel: 3,
        zoom_in: $('#zoom_in'),
        zoom_out: $('#zoom_out')
    }
}, {
    setLevel: function (newLevel) {
        return  newLevel == 2 || newLevel == 19 ? this.level : newLevel;
    },
    isScale: function () {
        return this.level <= this.maxLevel && this.level >= this.minLevel;
    },
    isMaxScale: function () {
        return this.level == 18;
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
            imgAddress: 'images/start_point.png',
            imgWidth: 41,
            imgHeight: 36
        }, configEnd = {
            lng: mapHandler.shareInfo.lng,
            lat: mapHandler.shareInfo.lat,
            id: 'end_pos',
            imgAddress: 'images/end_point.png',
            imgWidth: 41,
            imgHeight: 36
        };
        mapHandler.startMarker = mapHandler.addMarker(configStart);
        mapHandler.endMarker = mapHandler.addMarker(configEnd);
    },
    setScaleBtnUi: function () {
        if (this.isMaxScale()) {
            this.zoom_in.removeClass('active').addClass('gray');
            return;
        }
        if (this.isMinScale()) {
            this.zoom_out.removeClass('active').addClass('gray');
            return;
        }
        this.zoom_in.removeClass('active');
        if (this.zoom_in.hasClass('gray')) {
            this.zoom_in.removeClass('gray');
        }
        this.zoom_out.removeClass('active');
        if (this.zoom_out.hasClass('gray')) {
            this.zoom_out.removeClass('gray');
        }
    }

});

$.Model('MapRouteView', {
        defaults: {
            tmcIndexRate: 3.6,
            widthLightBar: 0.95,
            tmcContainer: $('#route_tmc'),
            normalContainer: $('#route_normal'),
            tmcTrafficIndex: $('#tmc_traffic_index'),
            tmcDistance: $('#tmc_distance'),
            tmcTimeEle: $('#tmc_time'),
            normalTrafficIndex: $('#normal_traffic_index'),
            normalDistance: $('#normal_distance'),
            normalTimeEle: $('#normal_time'),
            saveTimeEle: $('#save_time_number'),
            trafficIndice: {
                green: 'images/green.png',
                yellow: 'images/yellow.png',
                red: 'images/red.png'
            },
            arrTrafficCol: ['#c7c7c7', '#1de822', '#ffde00', '#da1e10']
        }
    },
    {
        init: function (config) {
            if (typeof config === 'undefined') {
                return;
            }
            this.normalRouteLength = config.normalRouteLength;
            this.normalTime = config.normalTime;
            this.tmcRouteLength = config.tmcRouteLength;
            this.tmcTime = config.tmcTime < config.normalTime ? config.tmcTime : config.normalTime;
            this.arrTmcTraffic = config.arrTmcTraffic;
            this.arrNormalTraffic = config.arrNormalTraffic
        },
        drawLight: function (arrTraffic, container, length) {
            if (container.find('p').length != 0) {
                container.find('p').remove();
            }
            var totalLength = $(document.body).width() - 18,
                $p = $('<p/>', {
                    width: totalLength + 'px'
                }).addClass('light_bar'),
                that = this;
            $.each(arrTraffic, function (i, n) {
                var len = n / length * totalLength,
                    color = that.arrTrafficCol[that.arrTmcTraffic[1][i]];
                $('<blockquote/>')
                    .css({
                        width: len + 'px',
                        backgroundColor: color
                    })
                    .addClass('light_bar_seg')
                    .appendTo($p);

            });
            $p.appendTo(container);
        },
        displayData: function () {
            this.displayTmcData();
            this.displayNormalData();
            this.setUi();
        },
        setUi: function () {
            var $path_info = $('#path_info'), bottomHeight = $path_info.height(), $poiDiv = $('#poi_div'), $zoomOut = $('#zoom_out'), $zoomIn = $('#zoom_in'), $positioning = $('#positioning');
            $path_info.css('bottom', $('#link_bar').outerHeight());
            $path_info.css('visibility', 'visible');
            if ($('#poi_div').hasClass('shrink')) {
                $zoomOut.css({'bottom': parseFloat($zoomOut.css('bottom')) + bottomHeight});
                $zoomIn.css({'bottom': parseFloat($zoomIn.css('bottom')) + bottomHeight});
                $positioning.css({'bottom': parseFloat($positioning.css('bottom')) + bottomHeight});
            } else {
                $zoomOut.css({'bottom': parseFloat($zoomOut.css('bottom')) + bottomHeight - $poiDiv.height()});
                $zoomIn.css({'bottom': parseFloat($zoomIn.css('bottom')) + bottomHeight - $poiDiv.height()});
                $positioning.css({'bottom': parseFloat($positioning.css('bottom')) + bottomHeight - $poiDiv.height()});
            }
        },
        getTrafficIndiceBg: function (trafficInd) {
            return 'url(' + this.trafficIndice[this.getTrafficIndiceCol(trafficInd)] + ')';
        },
        displayTmcData: function (lenTime) {
            this.tmcDistance.text(util_common.unit_conversion(this.tmcRouteLength));
            this.tmcTimeEle.text(this.tmcTime + ' 分钟');
            var trafficInd = this.getTrafficInd(this.getSpeed(this.tmcRouteLength, this.tmcTime));
            this.tmcTrafficIndex
                .text(trafficInd)
                .css('background-image', this.getTrafficIndiceBg(trafficInd));
            if (this.normalTime - this.tmcTime > 0) {
                this.saveTimeEle.text(this.normalTime - this.tmcTime);
            } else {
                $('#save_time,#bg_save_time').hide();
            }
            this.drawLight(this.arrTmcTraffic[0], this.tmcContainer, this.tmcRouteLength);
        },
        displayNormalData: function () {
            this.normalDistance.text(util_common.unit_conversion(this.normalRouteLength));
            this.normalTimeEle.text(this.normalTime + ' 分钟');
            var trafficInd = this.getTrafficInd(this.getSpeed(this.normalRouteLength, this.normalTime));
            this.normalTrafficIndex
                .text(trafficInd)
                .css('background-image', this.getTrafficIndiceBg(trafficInd));
            this.drawLight(this.arrNormalTraffic[0], this.normalContainer, this.normalRouteLength);
        },
        getSpeed: function (length, time) {
            return length / (time * 60) * this.tmcIndexRate;
        },
        getTrafficInd: function (speed) {
            if (speed > 0 && speed <= 10) {
                return 1;
            } else if (speed > 10 && speed <= 15) {
                return 2;
            } else if (speed > 15 && speed <= 20) {
                return 3;
            } else if (speed > 20 && speed <= 25) {
                return 4;
            } else if (speed > 25 && speed <= 30) {
                return 5;
            } else if (speed > 30 && speed <= 40) {
                return 6;
            } else if (speed > 40 && speed <= 50) {
                return 7;
            } else if (speed > 50 && speed <= 60) {
                return 8;
            } else if (speed > 60 && speed <= 80) {
                return 9;
            } else if (speed > 80) {
                return 10;
            }
        },
        /**
         * 匹配交通颜色
         */
        getTrafficIndiceCol: function (index) {
            if (index > 0 && index <= 3) {
                return 'red';
            } else if (index > 3 && index <= 6) {
                return 'yellow';
            } else if (index > 6 && index <= 10) {
                return 'green';
            }
            return 0;
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
            $('#poi_div').css('visibility', 'hidden');
            $('#search_box').hide();
        }
    }
);