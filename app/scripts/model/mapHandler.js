/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/5/13
 * Time: 11:51 AM
 * Use:
 */
/**
 A utility that mapHandler model
 @class mapHandler
 @constructor
 **/
MapModel.mapHandler('MapModel.mapHandler', {
    /**
     The method to init the map zoom level
     @method initMapZoom.
     @return {Number}
     **/
    initMapZoom: function () {
        var ratio = devicePixelRatio;
        if (ratio == 2) {
            return this.iniZoom = 13;

        }
        if (ratio == 1.5) {
            return this.iniZoom = 14;
        }
        return this.iniZoom = 15;
    },
    /**
     The method to set the map zoom level
     @method setZoom.
     @param zoom number
     **/
    setZoom: function (zoom) {
        this.mapObj.setZoom(zoom);
    },
    moveCurMarker: function () {
        var objGps = new AMap.LngLat(this.curInfo.lng, this.curInfo.lat);
        this.curMarker.setPosition(objGps);
    },
    rotateCurMarkerOrMap: function () {
        if (mapHandler.northUp) {
            mapHandler.setNorthDirctionUp(this.curInfo);
        }
        else {
            mapHandler.setCurOverlayDirectionUp({nCarDirection: this.curInfo.nAngle});
        }
    },
    bindScreenRotation: function () {
        if (!publicModel.isNativeBrowserOfLenovo()) {
            return;
        }
        var supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize",
            that = this;

        window.addEventListener(orientationEvent, function () {
            var width = 0
            if (isNaN(window.orientation)) {
                width = Math.abs(window.orientation) == 90 ? width = $(window).width() : 'device-width'
            } else {
                width = screen.width > screen.height ? $(window).width() : 'device-width'
            }
            var content = ' width=' + width + ', initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
            $('meta[name="viewport"]').attr('content', content)
        }, false);
    },
    /**
     The method to set the map rotation angle
     @method setCurOverlayDirectionUp.
     @param DGNaviInfor object
     **/
    setCurOverlayDirectionUp: function (DGNaviInfor) {
        var t = DGNaviInfor.nCarDirection;
        $('img[src="images/cur_position.png"]').css('-webkit-transform', 'rotate(' + t + 'deg)');
        //根据tbt返回的角度旋转地图
        this.mapObj.setRotation(-t);

    },
    /**
     The method to set cur_pos element state
     @method setNorthDirctionUp.
     @param DGNaviInfor object
     **/
    setNorthDirctionUp: function (DGNaviInfor) {
        $('img[src="images/cur_position.png"]').css('-webkit-transform', 'rotate(' + DGNaviInfor.angle + 'deg)');
    },

    //todo 最好使用api提供的show,hide方法，不兼容ios，等待高德解决
    /**
     The method to add tmc layer
     @method addTmcLayer.
     **/
    addTmcLayer: function () {
        if (!this.mapObj.getLayer('traffic_layer')) {
            var tmc = new AMap.TileLayer({
                id: this.tmcLayerId,
                zIndex: 2,
                detectRetina: true,
                getTileUrl: function (x, y, z) {
                    return "http://tm.mapabc.com/trafficengine/mapabc/traffictile?v=1.0&t=1&zoom=" + (17 - z) + "&x=" + x + "&y=" + y;
                }
            });
            //如果动态交通里的功能设定页面没有选择显示动态交通信息，则不添加交通图层，如果未设置过该选项，则本地变量未初始化
            this.mapObj.addLayer(tmc);
        }
    },
    addMarkerOverlay: function (marker) {
        this.mapObj.addOverlays(marker);
    }, /**
     The method to add marker
     @method addMarker.
     @param config object
     **/
    addMarker: function (config) {
        if (this.mapObj == null) {
            return;
        }
        var markerOption = {
            id: config.id,
            coord: this.generateLngLat(config.lng, config.lat),
            imgAddress: config.imgAddress,
            imgWidth: config.imgWidth,
            imgHeight: config.imgHeight
        };
        var marker = this.addIcon(markerOption);
        this.addMarkerOverlay(marker);
        return marker;
    },
    generateMarkerObj: function (markerOptions) {
        return new AMap.Marker(markerOptions);
    },
    generateMarkerOption: function (config) {
        var markerOptions = {},
            horizon = config.imgWidth / 2,
            vertical = config.imgHeight;
        //设置覆盖物标注点类型的图片url
        markerOptions.icon = new AMap.Icon({
            image: config.imgAddress,
            //size:图标所在区域长宽
            size: new AMap.Size(config.imgWidth, config.imgHeight)
        });
        //设置标注点类型覆盖物的id属性
        if (config.id) {
            //如果id重复，会自动删除过去添加的同值id覆盖物
            markerOptions.id = config.id;
        }
        markerOptions.position = config.coord;
        //对象相对于基点的偏移量。保证覆盖物图片中心位于基点中心
        markerOptions.offset = new AMap.Pixel(-horizon, -vertical);
        return markerOptions;
    }, /**
     The method to add icon
     @method addIcon.
     @param config object
     @return {Object}
     **/
    addIcon: function (config) {
        var markerOptions = this.generateMarkerOption(config);
        var marker = this.generateMarkerObj(markerOptions);
        return marker;
    },
    /**
     The method to build infowindow string
     @method buildInfowindowStr.
     @param name name
     @param address address
     @return {Object}
     **/
    buildInfowindowStr: function (name, address) {
        var classSet = '';
        if (address) {
            classSet = 'class="share_content_offset"';
        }
        return publicModel.buildEleStrByTmpl("share_ele", {
            classSet: classSet,
            shareTitle: this.shareTitle,
            name: name,
            address: address
        });
    },
    /**
     The method to obtain the map zoom level
     @method getZoom.
     @return {Number}
     **/
    getZoom: function () {
        return this.mapObj.getZoom();
    },
    /**
     The method to set path weight
     @method setPathWeight.
     @param strokeWeight number
     @param polyline object
     **/
    setPathWeight: function (strokeWeight, polyline) {
        var obj = polyline.getOptions();
        obj.strokeWeight = strokeWeight;
        var polyOption = new AMap.Polygon(obj);
        polyline.setOptions(polyOption);
    },
    /**
     The method to generate map
     @method generateMap.
     @param _ret object
     **/
    generateMap: function (_ret) {
        var mapOptions = {
            level: this.initMapZoom(),
            zooms: this.zooms,
            center: this.generateLngLat(_ret.lng, _ret.lat),
            jogEnable: false,
            touchZoom: true
        };
        if (window.devicePixelRatio >= 1.5) {
            mapOptions.defaultLayer = new AMap.TileLayer({
                detectRetina: true
            });
//        todo if set 17, it perhaps conflict to this.zooms, lead to zoom out the biggest level and zoom in no change at first time
            mapOptions.zooms = [3, 17];
        }
        this.mapObj = new AMap.Map('map_container', mapOptions);
        this.bindScreenRotation()
    },
    /**
     The method to remove tmc layer
     @method removeTmcLayer.
     **/
    removeTmcLayer: function () {
        this.mapObj.removeLayer(this.tmcLayerId);
    },
    /**
     The method to set infowindow draggable. there are no parent selectors in CSS, so js code needed
     @method enableDragInfoWin.
     **/
    enableDragInfoWin: function () {
        var $shareDiv = $('#share_div');
        $shareDiv.parent().css('pointer-events', 'none');
    },
    /**
     The method to handle zoom change event
     @method handleZoomChangeEve.
     @param mapObj object
     @param callback function
     **/
    handleZoomChangeEve: function (callback) {
        AMap.event.addListener(this.mapObj, 'zoomchange', callback);
    },
    /**
     The method to set map fitview
     @method setFitView.
     **/
    setFitView: function () {
        this.mapObj.setFitView();
    },
    setPathFitView: function (callback, lngLat) {
        var that = this;
        setTimeout(function () {
            var viewHeightPixel = new AMap.Pixel(0, $('#map_container').height() - $('#path_info').outerHeight()),
                containerPixel = new AMap.Pixel(0, $('#map_container').height()),
                northLngLat = mapHandler.mapObj.containTolnglat(viewHeightPixel),
                southLngLat = mapHandler.mapObj.containTolnglat(containerPixel),
                span = Math.abs(southLngLat.lat - northLngLat.lat);
            that.setPathBounds(lngLat.maxlng, lngLat.maxlat, lngLat.minlng, lngLat.minlat, span, 0);
            callback();
        },500);
        this.mapObj.setFitView();
    },
    /**
     The method to set map zoomout
     @method zoomOut.
     **/
    zoomOut: function () {
        this.mapObj.zoomOut();
    },
    /**
     The method to generate infowindow
     @method generateInfoWindow.
     @param info object
     **/
    generateInfoWindow: function (info) {
        this.inforWindow = new AMap.InfoWindow(info);
    },
    /**
     The method to generate lnglat object
     @method generateLngLat.
     @param lng number
     @param lat number
     @return {Object}
     **/
    generateLngLat: function (lng, lat) {
        return new AMap.LngLat(lng, lat);
    },
    /**
     The method to open infowindow
     @method openInfoWin.
     **/
    openInfoWin: function () {
        this.inforWindow.open(this.mapObj, this.infoPos);
    },
    /**
     The method to switch marker state
     @method toggleMarker.
     @param isVisibility Blooean
     **/
    toggleMarker: function (isVisibility) {
        $.each(mapHandler.mapObj.getOverlaysByType('marker'), function (i, n) {
            isVisibility ? n.show() : n.hide();
        })
    },
    correctPosition: function (lng, lat, callback) {
        AMap.MAjaxResult = {};
        AMap.MAjaxResult['correctPosition'] = {};
        var url = "http://restapi.amap.com/coordinate/simple?sid=15001&ia=1&xys=" + lng + "," + lat + "&resType=json&rid='correctPosition'&key=0aa17a679101794a2bc8979b3eb332a7";
        $.getScript(url, function () {
            var lnglat = {};
            lnglat.lng = lng;
            lnglat.lat = lat;
            if (AMap.MAjaxResult['correctPosition'].status == "E0") {
                lnglat.lng = AMap.MAjaxResult['correctPosition'].xys.split(',')[0];
                lnglat.lat = AMap.MAjaxResult['correctPosition'].xys.split(',')[1];
            }
            callback(lnglat);
        });
    }
})