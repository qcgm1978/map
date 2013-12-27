/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  Util.common
 * @author wangyonggang qq:135274859
 * @classdesc 提供一些常用方法
 */
define([ 'jquerymx'], function () {
    /**
     A utility that common model
     @class common
     @constructor
     **/
    $.Class.extend('Util.common', {},
        {
            /**
             The method is to conversion unit
             @method unitConversion.
             @param config object
             @return {Object}
             **/
            unitConversion: function (config) {
                var configUnit = {};
                try {
                    configUnit.length = this.unit_conversion(config.length, 1),
                        configUnit.time = this.formatMinute(config.time)
                }
                catch (e) {
                    configUnit.length = '' , configUnit.time = '';
                }
                return configUnit;
            },
            /**
             The method is to format time
             @method formatMinute.
             @param newM number
             @return {String}
             **/
            formatMinute: function (newM) {
                if (typeof newM !== 'undefined' && newM != Infinity) {
                    var minute = Math.round(newM);
                    if (minute < 61)
                        return minute + "分钟";
                    else {
                        var h = Math.floor(minute / 60);
                        var m = minute % 60;
                        return h + "小时" + m + "分钟";
                    }
                } else {
                    return '未知';
                }
            },
            /**
             The method is to conversion unit
             @method unit_conversion.
             @param m number
             @param decimal number
             @return {String}
             **/
            unit_conversion: function (m, decimal) {
                if (m == Infinity)
                    return "未知";
                if (m < 1000) {
                    if (m >= 1) {
                        return parseInt(m) + 'm';
                    } else {
                        return '1m';
                    }
                }
                else {
                    //number的字符串表示，不采用指数计数法，小数点后有固定的digics位数字。如果 必要，该数字会被舍入，也可以用0补足，以便它达到指定的长度。
                    var k = 0;
                    //如果大于等于100公里，不显示小数
                    if (m / 1000 >= 100) {
                        k = (m / 1000).toFixed(0);
                    }
                    else {
                        k = (m / 1000).toFixed(decimal);
                    }
                    return k + ' km';
                }

            },
            /**
             The method is to get dpi
             @method js_getDPI.
             @return {Array}
             **/
            js_getDPI: function () {
                var arrDPI = new Array();
                if (window.screen.deviceXDPI != undefined) {
                    arrDPI[0] = window.screen.deviceXDPI;
                    arrDPI[1] = window.screen.deviceYDPI;
                }
                else {
                    var tmpNode = document.createElement("DIV");
                    tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
                    document.body.appendChild(tmpNode);
                    arrDPI[0] = parseInt(tmpNode.offsetWidth);
                    arrDPI[1] = parseInt(tmpNode.offsetHeight);
                    tmpNode.parentNode.removeChild(tmpNode);
                }
                return arrDPI;
            },
            /**
             The method is to parse url
             @method parseUrl.
             @param url string
             @return {Object}
             **/
            parseUrl: function (url) {
                var str = decodeURI(url),
                    reg = /.*\?(.*)/;
                var match = /.*\?(.*)/.exec(str);
                if (match == null) {
                    return null;
                }
                var arr = match[1].split('&'),
                    obj = {};
                $.each(arr, function (i, n) {
                    var arrItem = n.split('=');
                    obj[arrItem[0]] = arrItem[1];
                });
                return obj;

            },
            /**
             This method is to determine whether the air
             @method judgeVal.
             @param val object
             @return {Blooean}
             **/
            judgeVal: function (val) {
                return val != '' && val != 'undefined' && val != null;
            },
            /**
             This method is to truncate string
             @method truncateStr.
             @param str string
             @param maxLength number
             @return {String}
             **/
            truncateStr: function (str, maxLength) {

                if (str.length > maxLength) {
                    return str.slice(0, maxLength - 3) + '...';
                }
                return str;
            },
            /**
             This method is toset touch event
             @method setTouchEvent.
             @param elector string
             @param eventCallback function
             @param eventEndCallback function
             **/
            setTouchEvent: function (elector, eventCallback, eventEndCallback) {


                $(elector).on({
                    'touchstart': function () {
                        eventCallback.call(this);
                    },
                    'touchend': function () {
                        eventEndCallback.call(this);
                    },
                    'touchmove': function () {
                        $(elector).removeClass('active');
                    }/* ,
                     'mousedown':function () {
                     eventCallback.call(this);
                     },
                     'mouseup':function () {
                     eventEndCallback.call(this);
                     },
                     'mouseleave':function () {
                     eventEndCallback.call(this);
                     }*/
                });
            },
            /**
             This method is to get position
             @method getPos.
             @param obj object
             **/
            getPos: function (obj) {
                if (obj == null) {
                    return;
                }
                var pos = {"top": 0, "left": 0};
                if (obj.offsetParent) {
                    while (obj.offsetParent) {
                        pos.top += obj.offsetTop;
                        pos.left += obj.offsetLeft;
                        obj = obj.offsetParent;
                    }
                } else if (obj.x) {
                    pos.left += obj.x;
                } else if (obj.x) {
                    pos.top += obj.y;
                }
                return pos;
            },
            /**
             This method is to set animate ele visibility
             @method animateDisplayLayer.
             @param $ele object
             @param top number
             @param height number
             **/
             animateDisplayLayer: function ($ele, top, height) {
                $ele.stop(true, false).animate({top: top, height: height}, { speed: "slow", queue: false });
            },
            /**
             This method is to set swithc ele state
             @method promptUser.
             @param id string
             **/
            promptUser: function (id) {
                $('#' + id).removeClass('hidden');
                setTimeout(function () {
                    $('#' + id).addClass('hidden');
                }, 4000);
            }

        });
})
