/**
 * @class RequestPathFrame类
 * @construct RequestPathFrame
 */
$.Model('MapModel.RouteRequestFrame', {
    defaults: {
        iGpsCount: 0,
        isRequestPath: false,
        tbt: null,
        remain_metre: Infinity,
        tbt_remain_miniute: Infinity,
        routeType: 5, //多路径请求
        tmcType: 4,
        linksData0: null,
        linksData4: null
    }
}, {
    /**
     Method for automatic call instantiated
     @method init.
     **/
    init: function (config) {
        if (typeof  config === 'undefined') {
            return;
        }
        this.callback = config.callback;
        this.failCallback = config.failCallback;
        this.tbt = new MRoute.CTBT(this, "");
    },
    /**
     Method for switch elements of loading icon_request_path effect and isRequestPath attr
     @method triggerRequestEvent.
     **/
    triggerRequestEvent: function () {
        this.toggleLoadingEffect();
        this.attr('isRequestPath', true);
    },
    /**
     Method for switch elements of loading map_layer effect
     @method toggleLoadingEffect.
     **/
    toggleLoadingEffect: function () {
        $('#loading').toggleClass('hidden');
        $('#map_layer').toggleClass('map_layer');
    },
    /**
     Method for recoverRequestState
     @method recoverRequestState.
     **/
    recoverRequestState: function () {
        this.attr('isRequestPath', false);
        this.linksData0 = this.linksData4 = null;
    },
    /**
     * 创建一个光柱
     * 当前路径有动态信息则返回分段路况信息
     * @return [Array1,Array2],Array1数组指示分段路长，Array2数组指示分段路况
     */
    getSomeLenRouteTraffic: function (iType) {
        this.tbt.SelectRoute(iType)
        return this.tbt.CreateTMCBar(0, this.getRouteLength(iType));
    },


    /**
     * 获得一个导航段的旅行时间,单位分钟，向上取整
     * @param iSegIndex 导航段编号，编号从0开始
     * @return {Number}
     */
    getNavSegTime: function (iSegInd) {
        return this.tbt.GetSegTime(iSegInd);
    },
    /**
     * 获得一个导航段的长度,单位：米，向上取整
     * @param iSegIndex 导航段编号
     * @return {Number}
     */
    getNavSegLength: function (iSegIndex) {
        return this.tbt.GetSegLength(iSegIndex);
    },
    /**
     Method for set request route type
     @method setRequestRouteType.
     * @param iType 导航段路径类型
     **/
    setRequestRouteType: function (iType) {
        this.tbt.SelectRoute(iType);
    },
    /**
     Method for get route length
     @method getRouteLength.
     * @param iType 导航段路径类型
     * @return {Number}
     **/
    getRouteLength: function (iType) {
        this.tbt.SelectRoute(iType);
        return this.tbt.GetRouteLength();
    },
    /**
     Method for get route time
     @method getRouteTime.
     * @param iType 导航段路径类型
     * @return {Number}
     **/
    getRouteTime: function (iType) {
        this.tbt.SelectRoute(iType);
        return this.tbt.GetRouteTime();
    },
    getLightsByLinks: function (i, n) {
        if (this.tbt.HasLinkLight(i, n)) {
            this['linksData' + this.curType].numLight++;
        }
    },
    getMainAndSecondaryRoads: function (strMainRoad, roadClass) {
        if (String(strMainRoad).indexOf(roadClass) !== -1) {
            this['linksData' + this.curType].numMainRoad++;
        }
        else {
            this['linksData' + this.curType].numSecondaryRoad++;
        }
    },

    getLinksData: function () {
        if (!this.isRequestPath) {
            return {};
        }
        if (this['linksData' + this.curType]) {
            return this['linksData' + this.curType];
        }
        this['linksData' + this.curType] = {
            numLight: 0,
            numSecondaryRoad: 0,
            numMainRoad: 0
        }
        var roadClass = 0,
            roadPreName = roadName = '',
        //            0,1,6,7 are all main roads
            strMainRoad=[0,1,6,7].join()
        for (var i = 0; i < this.tbt.GetSegmentNum(); i++) {
            for (var n = 0; n < this.tbt.GetLinkNum(i); n++) {
                var roadClass = this.tbt.GetLinkRoadClass(i, n),
                    roadName = this.tbt.GetLinkRoadName(i, n)
                this.getLightsByLinks(i, n);
                if (roadPreName == roadName) {
                    continue;
                }
                this.getMainAndSecondaryRoads(strMainRoad, roadClass);
                roadPreName = roadName;
            }
        }
        return this['linksData' + this.curType];
    },
    getGuideList: function (iRouteType) {
        this.tbt.SelectRoute(iRouteType);
        var data = this.tbt.GetNaviGuideList(),
            arr = [],
            index = 0,
            that = this;
        $.each(data, function (i, n) {
            var num = that.tbt.GetSegLocationCodeNum(i);
            if (num) {
                for (var k = 0; k < num; k++) {
                    var locationCode = that.tbt.GetSegLocationCode(i, k);
                    arr.push({
                        index: index,
                        lc: locationCode,
                        stus: that.tbt.GetRoadStatus(locationCode.code)
                    })
                }
            }
            index++
        })
        return arr;
    },
    _selectRouteType: function (iType) {
        this.tbt.SelectRoute(iType);
        this.curType = iType;
    },
    getRouteLights: function (iType) {
        this._selectRouteType(iType);
        return this.getLinksData().numLight;
    },
    getMainRoadNum: function (iType) {
        this._selectRouteType(iType);
        return this.getLinksData().numMainRoad;
    },
    getSecondaryRoadNum: function (iType) {
        this._selectRouteType(iType);
        return this.getLinksData().numSecondaryRoad;
    },
    /**
     Method for request path
     @method requestPath.
     * @param start 导航段路径起点
     * @param end 导航段路径终点
     **/
    requestPath: function (start, end) {
        this.tbt.SetCarLocation(new MRoute.NaviPoint(start.x, start.y));
        var pathState = this.tbt.RequestRoute(this.routeType, [ new MRoute.NaviPoint(
            end.x, end.y) ]);
    },
    /**
     Method for set gps info
     @method setGpsInfo.
     * @param curr 当前位置对象信息
     **/
    setGpsInfo: function (curr) {
        this.tbt.SetGPSInfo(curr.longitude, curr.latitude, curr.speed, curr.direction, curr.year, curr.month, curr.day, curr.hour, curr.minute, curr.second);
    },
    /**
     Method for start request
     @method startRequest.
     * @param start 请求路径的起点
     * @param end 请求路径的终点
     **/
    startRequest: function (start, end) {
        this.requestPath(start, end);

    },
    /**
     Method for destroy route
     @method RouteDestroy.
     **/
    RouteDestroy: function () {

    },
    NetRequestHTTP: function (iModelID, iConnectID, strURL, strHead, strData, bGetMode) {
        var that = this;
        new NGIRoute.RouteRequest(strURL, function (postStream) {
            that.tbt.ReceiveNetData(iModelID, iConnectID, postStream);
        });
    },
//    todo specify current postion gps, no call current
    setCurPos: function () {
        mapHandler.attr('curInfo', {
            lng: 116.30603541739156,
            lat: 39.98010078106883
        });
    },
    /**
     * 使用log中的位置信息作为gps导航的位置来源
     * @return {Number}
     */
    pushGPSLogLatLon: function () {
        var that = this;
        logGPSId = 0;
        var timer = setInterval(function () {
            that.GPSTimer_Tick(arrGpsLog2);
        }, 10);
        return timer;
    },
    /**
     * 读取GPS log文件中的记录并推送给tbt
     * @param arrgps log数组
     */
    GPSTimer_Tick: function (arrgps) {
        if (logGPSId < arrgps.length) {
            var curr = arrgps[logGPSId];
            this.setGpsInfo(curr);
            logGPSId++;
        } else {
            logGPSId = 0;
        }
    },
    StartEmulator: function () {
    },
    UpdateNaviInfor: function (DGNaviInfor) {
    },
    PlayNaviSound: function (iType, SoundStr) {
    },
    ArriveWay: function (iWayID) {

    },
    /**
     The method is called when the position changes
     @method CarLocationChange.
     * @param vpLocation 位置
     **/
    CarLocationChange: function (vpLocation) {
    },

    /**
     The method is set request route state
     @method SetRequestRouteState.
     * @param eState 返回的状态
     **/
    SetRequestRouteState: function (eState) {
        if (eState != 1) {
            this.failCallback();
            return;
        }
        this.callback();
    },
    CrossRequest: function (arrBack, arrFore, arrSegId) {
    },
    ShowCross: function (bgImageId, foreImageId, segRemainDist) {

    },
    HideCross: function () {

    },
    Reroute: function () {
    },
    RerouteForTMC: function () {
    },
    EndEmulatorNavi: function () {
    },
    TMCUpdate: function () {
    },
    ShowLaneInfo: function (iBackInfo, iSelectInfo) {
    },
    HideLaneInfo: function () {
    },
    ShowTrafficPanel: function (id) {
    },
    HideTrafficPanel: function () {
    },
    /*
     * This method is to get coords array
     @method getCoordsArray.
     @return {Array}
     */
    getCoordsArray: function () {
        var glist = this.tbt.GetSegmentNum(), path = [];
        for (var i = 0; i < glist; i++) {
            var coors = this.tbt.GetSegCoor(i);
            if (coors == null) {
                return;
            }
            var s = 0;
            for (var m = 0; m < coors.length - 1; m += 2) {
                path.push(mapHandler.generateLngLat(coors[m], coors[m + 1]));
            }
        }
        return path;
    },
    /*
     * This method is to get rapid path array
     @method getRapidPathInfo.
     @return {Obj}
     */
    getRapidPathInfo: function () {
        this.tbt.SelectRoute(4);
        return {
            path: this.getCoordsArray(),
            length: this.tbt.GetRouteLength(),
            time: this.tbt.GetRouteTime()
        };
    },
    /*
     * This method is to get rapid path array
     @method getNormalPathInfo.
     @return {Obj}
     */
    getNormalPathInfo: function () {
        this.tbt.SelectRoute(0);
        return {
            path: this.getCoordsArray(),
            length: this.tbt.GetRouteLength(),
            time: this.tbt.GetRouteTime()
        };
    }
});


NGIRoute = {};
NGIRoute.RouteRequestData = {};//请求结果缓存对象
NGIRoute["RouteRequestCB"] = function (rid, data) {
    NGIRoute.RouteRequestData[rid] = data;
};
NGIRoute["RouteRequest"] = function (url, func) {
    var rid = Math.round(Math.random() * 100000);
    var __script = document.getElementById(rid);
    if (__script) {
        document.getElementsByTagName("head")[0].removeChild(__script);
    }
    __script = document.createElement("script");
    __script.id = rid;
    __script.type = "text/javascript";
    __script.src = url + "&cbk=NGIRoute.RouteRequestCB&rid=" + rid;
    document.getElementsByTagName("head")[0].appendChild(__script);
    var __self = this;
    if (/msie/i.test(navigator.userAgent) && !/msie 9.0/i.test(navigator.userAgent)) {//IE
        __script.onreadystatechange = function () {
            if (this.readyState == "loaded" || this.readyState == "complete") {
                __self.ajaxResult();
            }
        }
    } else {//firefox,chrom etc.
        __script.onload = function () {
            __self.ajaxResult();
        };
        __script.onerror = function () {
            if (func) {
                func(null);
            }
        };
    }

    this.ajaxResult = function () {
        if (NGIRoute.RouteRequestData[rid]) {//加载服务数据
            if (func) {
                func(NGIRoute.RouteRequestData[rid]);
            }
            document.getElementsByTagName("head")[0].removeChild(document.getElementById(rid));//删除JS文件
            NGIRoute.RouteRequestData[rid] = null;
            delete NGIRoute.RouteRequestData[rid];
        } else {
            if (func) {
                func(NGIRoute.RouteRequestData[rid]);
            }
        }
    }
};
