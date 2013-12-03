/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/5/13
 * Time: 5:45 PM
 * Use:
 */
/**
 A utility that draw path model
 @class PathDrawing
 @constructor
 **/
$.Model('MapModel.PathDrawing', {
        defaults: {
            color: '',
            tmcPathCol: '#b432d2',
            normalPathCol: '#0090ff',
            highLightCol: "#00f0ff",
            /**
             unselected path color
             @property unselectedCol
             * */
            unselectedCol: '#000',
            unselectedOpacity: 0.3,
            lineInfo: {
                strokeOpacity: 1,
                strokeWeight: 6,
                fillOpacity: 0.8
            },
            tmcData: {
                minLng: Number.MAX_VALUE,
                maxLng: Number.MIN_VALUE,
                minLat: Number.MAX_VALUE,
                maxLat: Number.MIN_VALUE
            },
            normalData: {
                minLng: Number.MAX_VALUE,
                maxLng: Number.MIN_VALUE,
                minLat: Number.MAX_VALUE,
                maxLat: Number.MIN_VALUE
            },
            lines: [],
            lines4: [],
            lines0: [],
            path: [],
            highLightTmcPath: true,
            pathState: 4,
            normalPathArray: [],
            rapidPathArray: [],
            mapObj: null
        }}, {
        /**
         Method for automatic call instantiated
         @method init.
         **/
        init: function (config) {
            if (typeof config !== 'undefined') {
                this.mapObj = config.mapObj;
                this.path = config.path;//多段线经纬度数组
                this.normalInfo = config.normalInfo;
                this.rapidInfo = config.rapidInfo;
                this.routeTraffic = config.routeTraffic;
                this.rapidPathArray = this.rapidInfo.path;
                this.normalPathArray = this.normalInfo.path;
                this.tmcRouteTraffic = config.tmcRouteTraffic
                this.normalRouteTraffic = config.normalRouteTraffic
                this.pathColor = config.pathColor
            }
        },
        optimizePathData: function (arr) {
            if (this.isOptimize) {
//                todo if the ele not on a single line, the optimization will skipt the corner
                 return [arr[0],arr[arr.length-1]]
            }
                return arr;
//            var arrNew = [];
//            $.each(arr, function (i, n) {
//                if (i % 5 == 0) {
//                    arrNew.push(n)
//                }
//            })
//            return arguments.callee(arrNew);
        },
        getTmcData: function () {
            return this.tmcData;
        },
        getNormalData: function () {
            return this.normalData;
        },
        getMinVal: function (q) {
            var data = this.pathState == 4 ? this.tmcData : this.normalData;
            data.minLng = q.lng < data.minLng ? q.lng : data.minLng;
            data.maxLng = q.lng > data.minLng ? q.lng : data.maxLng;
            data.minLat = q.lat < data.minLat ? q.lat : data.minLat;
            data.maxLat = q.lat > data.minLat ? q.lat : data.maxLat;
        },
        dividePath: function (arr) {
            var arrByTraffic = [],
                arrDividedByTraffic = [],
                arrTraffic = [];
            if (this.pathState == 4) {
                arrTraffic = this.tmcRouteTraffic;
            } else {
                arrTraffic = this.normalRouteTraffic;
            }
            return this.generatePathArrByTraffic(arr, arrTraffic)
        },
        getLastPath: function (arrItem, arr, middleCoord, arrTraffic) {
            arrItem = arr.slice(p)
            if (middleCoord != null) {
                arrItem.unshift(middleCoord)
            }
            arrItem[0].colorInd = arrTraffic[1][m]
            return arrItem;
        },
        generatePathArrByTraffic: function (arr, arrTraffic) {
            var len = lenToPrev = distance = m = p = 0   ,
                arrToStart = [],
                arrItem = [],
                arrByTraffic = [],
                lastSeg = null,
                that = this;
//            get arr containing distance to start of every point
            $.each(arrTraffic[0], function (i, n) {
                if (!i) {
                    arrToStart[i] = n;
                    return;
                }
                arrToStart[i] = arrToStart[i - 1] + n;
            })
            $.each(arr, function (i, n) {
                that.getMinVal.call(that, n);
                if (i == 0) {
                    return;
                }
                var distanceNext = distance + mapHandler.getDistance(arr[i - 1], arr[i])
//                todo handle data exception, sometimes m== arrToStart.length
//                @example http://localhost/map/app/start.html?name=%E5%9C%B0%E5%9B%BE%E9%80%89%E7%82%B9&lng=116.275825&lat=39.951614&type=1#requestPath
//                invalid perhaps above because path plan maybe change
                if (i == arr.length - 1 || m >= arrToStart.length) {
                    arrByTraffic.push(that.getLastPath(arrItem, arr, lastSeg, arrTraffic));
                    return false;
                }
                if (distanceNext < arrToStart[m]) {
                    distance = distanceNext;
                    return;
                }
                arrItem = arr.slice(p, i)
                if (lastSeg != null) {
                    arrItem.unshift(lastSeg)
                }
                lenToPrev = arrToStart[m] - distance;
                lastSeg = mapHandler.getSectionNodeCoord(arr[i - 1], n, lenToPrev, mapHandler.getDistance(arr[i - 1], n));
                arrItem.push(lastSeg)
                arrItem[0].colorInd = arrTraffic[1][m]
                arrByTraffic.push(that.optimizePathData(arrItem))
                distance = distanceNext;
                p = i;
                m++
            })
            return arrByTraffic;
        },
        setPathColOpacity: function (color) {
            var pathColor = strokeOpacity = '';
            if ((this.highLightTmcPath && this.pathState == 4) || (!this.highLightTmcPath && this.pathState == 0)) {
                pathColor = this.pathColor[ color];
                strokeOpacity = 1;
            } else {
                pathColor = this.unselectedCol;
                strokeOpacity = this.unselectedOpacity
            }
            return {
                pathColor: pathColor,
                strokeOpacity: strokeOpacity

            };
        }, /**
         This method is to add one polyline
         @method addOnePolyline.
         @param config object
         **/
        addOnePolyline: function (config) {
            this.id = this.mapObj.getOverlaysByType('polyline').length;
            var lineId = ('line' + this.id),
                that = this;
            this.isOptimize = config.path.length <= 1000 ? false : true;
            $.each(this.dividePath(config.path), function (i, n) {
                var color = n[0].colorInd;
                var colOpacity = that.setPathColOpacity.call(that, color)
                var line = new AMap.Polyline({
                    path: n,
//                todo no updated, id deprecated
                    id: "NGIRoute" + that.id++,
                    strokeColor: colOpacity.pathColor, //线颜色
                    strokeOpacity: colOpacity.strokeOpacity, //线透明度
                    strokeWeight: config.strokeWeight //线宽

                });
                line.setMap(that.mapObj);
                if (that.pathState == 4) {
                    that.lines4.push(line);
                } else {
                    that.lines0.push(line);
                }
            })
        },
        /**
         This method is to add path
         @method drawPath.
         **/
        drawPath: function () {
            if (this.normalInfo.length == this.rapidInfo.length && this.normalInfo.time == this.rapidInfo.time) {
                this.drawRapidPath();
            } else {
                if (this.highLightTmcPath) {
                    this.drawNormalPath();
                    this.drawRapidPath();
                    this.highLightTmcPath = false;
                } else {
                    this.drawRapidPath();
                    this.drawNormalPath();
                    this.highLightTmcPath = true
                }
            }
        },
        /**
         This method is to remove multi path
         @method removePolylines.
         **/
        removePolylines: function () {
            $.each(this.lines4, function (i, n) {
                n.setMap(null)
            })
            $.each(this.lines0, function (i, n) {
                n.setMap(null)
            })
        },
        /**
         This method is to add the rapid path
         @method drawRapidPath.
         **/

        drawRapidPath: function () {
            this.lineInfo.color = this.tmcPathCol;
            this.lineInfo.path = this.rapidPathArray;
            this.pathState = 4;
            this.addOnePolyline(this.lineInfo);
        },
        /**
         This method is to add the normal path
         @method drawNormalPath.
         **/
        drawNormalPath: function () {
            this.lineInfo.color = this.normalPathCol;
            this.lineInfo.path = this.normalPathArray;
            this.pathState = 0;
            this.addOnePolyline(this.lineInfo);
        }
    }

)
;