/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/4/13
 * Time: 5:22 PM
 * Use:
 */
/*路书页model*/
define(['jquerymx'], function () {
    /**
     A utility that switch route tab controller
     @class Route
     @constructor
     **/
    $.Model('Route', {
        defaults: {
            curDisplayPath: Infinity,
            route_tabs: $('#route_tabs'),
            tabsContent: $('#tabsContent'),
            $route: $("#route"),
            imgSrc: 'images/public/list/',
            totalWidth: 300,
            scroll_first: 'scroll_first',
            scroll_second: 'scroll_second',
            rapidRouteArea: $('#scroll_first table'),
            normalRouteArea: $('#scroll_second table'),
            rout_type: Infinity,
            scrollUpdated: false,
            scrollObj: {firstScroll: null, secondScroll: null}
        }
    }, {
        /**
         Method for automatic call instantiated
         @method init.
         **/
        init: function (config) {
            this.unit = config.unit || 'km/h';
            this.colorArr = config.arrTrafficCol;
            var firstScroll = new iScroll(this.scroll_first, {
                snap: false,
                hScrollbar: false,
                vScrollbar: false,
                useTransition: true,
                hScroll: false,
                bounce: false,
                zoom: false,
                momentum: true,
                onScrollMove: function () {

                },
                onScrollEnd: function () {

                }
            });
            var secondScroll = new iScroll(this.scroll_second, {
                snap: false,
                hScrollbar: false,
                vScrollbar: false,
                useTransition: true,
                hScroll: false,
                bounce: false,
                zoom: false,
                momentum: true,
                onScrollMove: function () {

                },
                onScrollEnd: function () {

                }
            });
            this.scrollObj = {
                firstScroll: firstScroll,
                secondScroll: secondScroll
            };
            Array.prototype.max = function () {   //最大值
                return Math.max.apply({}, this)
            };
            Array.prototype.min = function () {   //最小值
                return Math.min.apply({}, this)
            };
        },
        /**
         The method is called when the element scroll
         @method setScrollUpdated.
         * @param newCurDisplayPath the new value
         * @param success callback
         * @param error callback
         **/
        setScrollUpdated: function (newCurDisplayPath, success, error) {
            if (newCurDisplayPath) {
                var self = this;
                setTimeout(function () {
                    if (self.$route.is(":animated")) {
                        self.$route.stop(true, true);
                    }
                    self.scrollObj.firstScroll.refresh();
                    self.scrollObj.secondScroll.refresh();
                    self.scrollObj.firstScroll.scrollTo(0,0)
                    self.scrollObj.secondScroll.scrollTo(0,0)
                }, 100);
            }
        },
        /**
         The method is set current display path
         @method setCurDisplayPath.
         * @param newCurDisplayPath the new value
         * @param success callback
         * @param error callback
         **/
        setCurDisplayPath: function (newCurDisplayPath, success, error) {
            if (newCurDisplayPath == 'A' || newCurDisplayPath == 'B') {
                this.route_tabs.find(">[data-tab]").removeClass("active");
                this.route_tabs.find(">[data-tab='" + newCurDisplayPath + "']").addClass("active");
                this.tabsContent.find(">[data-tab]").removeClass("active");
                this.tabsContent.find(">[data-tab='" + newCurDisplayPath + "']").addClass("active");
                this.setScrollUpdated(true);
            } else {
                return 'A';
            }
        },
        /**
         The method shows road seginfo
         @method showRoadSegInfo.
         * @return {Object}
         **/
        showRoadSegInfo: function () {
//            var data = requestPath.getGuideList(this.rout_type);
//            return this.callback(data);
            requestPath.tbt.SelectRoute(this.rout_type);
            var data = {
                xmlStr: requestPath.tbt.GetNaviGuideList()
            };
            return this.callback(data.xmlStr);
        },
        /**
         This method returns an analytical results
         @method callback.
         * @param data a object
         * @return {Object}
         **/
        callback: function (data) {
            var imgArr = [], obj = {}, segArr = [], maxLength = 0, width = 0, len = data.length, $tr, $tbody = $('<tbody></tbody>');
            for (var i = 0; i < len; i++) {
                segArr.push(data[i].distance);
            }
            //找出最大值
            obj.maxLength = segArr.max();
            obj.ios = publicModel.isIOS();
            for (var i = 0; i < len; i++) {
                var list = data[i];
                var icon = list.directionIcon,
                    name = list.roadName || '无名道路';
                var distance = util_common.routeUnitConversion(list.distance, 1),
                    img = new Image();
                img.src = this.imgSrc + icon + '.png';
                imgArr.push(img);
                obj.width = segArr[i] / obj.maxLength * this.totalWidth * 2 / 3 + this.totalWidth / 3;
                obj.segLength = segArr[i];
                obj.i = i;
                obj.averageRate = this.returnFloat1(requestPath.getNavSegLength(i) / requestPath.getNavSegTime(i) / 1000 * 60);
                var $name = $('<p/>').html(name),
                    $route = $('<p/>').css({display: 'inline-block', 'float': 'left', margin: '0', padding: '0'}).html(this.routeGuide(obj)),
                    $distance = $('<p/>').css({display: 'inline-block', 'float': 'left', marginTop: '4px', marginLeft: '6px'}).html(distance);
                $tr = $('<tr><td></td><td ></td><td><span class="number">' + obj.averageRate + '</span><span class="unit">' + this.unit + '</span></td></tr>');
                $tr.find('td').eq(0).append(img);
                $tr.find('td').eq(1).append($name).append($route).append($distance);
                $tbody.append($tr);

            }
            $tbody.find('td:first-of-type>img').each(function (index, el) {
                if (typeof $(el).attr('src') == "undefined") {
                    $(el).attr('src', imgArr[index].src);
                }
            });
            return $tbody;
        },
        /**
         This method returns a number with a decimal
         @method returnFloat1.
         * @param value a Number
         * @return {Number}
         **/
        returnFloat1: function (value) {
            value = Math.round(parseFloat(value) * 10) / 10;
            if (value.toString().indexOf(".") < 0)
                value = value.toString() + ".0";
            return value;
        },
        /**
         This method returns an object about traffic light beam
         @method routeGuide.
         * @param obj a object
         * @return {Object}
         **/
        routeGuide: function (obj) {
            var linkWidth = 0,
                i = obj.i,
                lc = {},
                stus = 0,
                segLength = obj.segLength,
                width = obj.width,
                color = '',
                maxLength = obj.maxLength,
                innerEleWidth = 0,
                border = obj.ios ? '1px solid #000' : '2px solid #000';
            $p = $('<p/>').css({
                border: border,
                borderRadius: '3px',
                margin: '0',
                padding: '0',
                display: 'inline-block'
            });
            var num = requestPath.tbt.GetSegLocationCodeNum(i);
            if (!num) {
                innerEleWidth = segLength / maxLength * width;
                innerEleWidth = innerEleWidth < 50 ? 50 : innerEleWidth;
                color = this.colorArr[0];
                var $innerP = $('<p/>').css({
                    height: '6px',
                    display: 'inline-block',
                    width: innerEleWidth,
                    backgroundColor: color,
                    margin: '0',
                    padding: '0',
                    'float': 'left'
                });
                $p.append($innerP);
            }
            for (var k = 0; k < num; k++) {
                lc = requestPath.tbt.GetSegLocationCode(i, k);
                stus = requestPath.tbt.GetRoadStatus(lc.code);
                linkWidth = lc.dist;
                color = this.colorArr[stus];
                innerEleWidth = linkWidth / segLength * width;
                var $innerP = $('<p/>').css({
                    height: '6px',
                    display: 'inline-block',
                    width: innerEleWidth,
                    backgroundColor: color,
                    margin: '0',
                    padding: '0',
                    'float': 'left'
                });
                $p.append($innerP);
            }
            return $p;

        }
    });
})