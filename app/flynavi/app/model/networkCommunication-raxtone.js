/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/12/13
 * Time: 5:54 PM
 * Use:
 */
define(['jquerymx'], function () {

    $.Model('MapModel.netServiceRaxtone', {
        defaults: {
//            requestLogin:false,
            /**
             会话协议报文加解密密钥
             @final
             **/
            ENCODE_SEED: 0x6E,
            urlRoutePrediction: 'http://testwww.flynavi.cn/date/road/forecast/getForecastTimes.do',
            urlLogin: 'http://testwww.flynavi.cn/date/user/login.do',
            sdLogin: 1,
            sdRoutePre: 80,
            pv: 1,
            pt: 4000,
            pm: 1002,
            cid: 100,
            cpwd: '37bb61ac344f4e76993ad18127cb819c',
            ver: 12,
            randomStr: String(Math.random() * 10e17),

            channelId: 1,
            output: 2,
            requestMode: "POST"
        }
    }, {
        init: function (config) {
            if (typeof config === 'undefined') {
                return;
            }
            this.loginErrorCallback = config.loginErrorCallback;
            this.notSupportPrediction=config.notSupportPrediction
        },
        /**
         解密

         * @param bytes
         * @returns {String} decoded utf8 format str
         */
        decryptBin: function (bytes) {
            var len = bytes.length,
                arr = [];
            for (var i = 0; i < len; i++) {
                arr[i] = (bytes[i] ^ this.ENCODE_SEED);
            }
            return this.decodeUtf8(arr.join(''));
        },

        /**
         加密

         * @param arr
         * @returns {Array} encoded binary arr
         */
        ecryptBin: function (arr) {
            if (arr.length == 0) {
                return [];
            }
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                arr[i] = (Number(arr[i]) ^ this.ENCODE_SEED);
            }
            return arr;
        },
        encodeUtf8: function (s) {
            return decodeURIComponent(encodeURIComponent(s));
        },

        decodeUtf8: function (s) {
            return decodeURIComponent(encodeURIComponent(s));
        },
        /*
         conver obj to binary arr
         *
         * */
        objToBinArr: function (obj) {
            var str = JSON.stringify(obj),
                arr = []
            for (var i = 0, len = str.length; i < len; i++) {
                var temp = str.charCodeAt(i).toString(2);
                arr.push(temp);
            }
            return arr;
        },
        getSid: function () {
            return this.sid;
        },
        getPlanType: function () {
            return this.planType;
        },
        requestRaxtoneRoutePre: function (sid, type, errorCallback, date) {
            this.date = date || new Date();
            if (!isNaN(type)) {
                this.planType = type;
            }
            var timeMilliseconds = this.date.getTime();
            var data = {
                    x1: mapHandler.curInfo.lng,
                    y1: mapHandler.curInfo.lat,
                    x2: mapHandler.shareInfo.lng,
                    y2: mapHandler.shareInfo.lat,
                    planTime: [ timeMilliseconds + 10 * 60 * 1000, timeMilliseconds + 20 * 60 * 1000],
                    flag: 0,
                    planType: type
                },
                headers = {
                    sid: sid,
                    sd: this.sdRoutePre,
                    pv: this.pv,
                    output: this.output
                },
                that = this;
            $.ajax({
                type: this.requestMode,
                url: this.urlRoutePrediction,
                headers: headers,
//                data: this.ecryptBin(this.objToBinArr(data)).join(''),
                data: JSON.stringify(data),
                success: function (data) {
                    try {
                        var rm = JSON.parse(data).rm;
                        if(rm.status==0){
                            that.notSupportPrediction()
                            return;
                        }
                        that.attr('dataPrediction', {
                            requestTime: that.date.getTime(),
                            timeExtend10: rm.result.times[0].totalTime,
                            timeExtend20: rm.result.times[1].totalTime
                        });
                    } catch (e) {
                        errorCallback()
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    errorCallback()
                }
            });
        },
        requestRaxtoneLogin: function () {
            var that = this,
                data = {
                    cid: this.cid,
                    cpwd: this.cpwd,
                    pm: this.pm,
                    pt: this.pt,
                    ver: this.ver,
                    mac: this.randomStr,
                    channelId: this.channelId
                },
                headers = {
                    sd: this.sdLogin,
                    pv: this.pv,
                    output: this.output
                };
            $.ajax({
                type: this.requestMode,
                url: this.urlLogin,
                headers: headers,
//                data: this.ecryptBin(this.objToBinArr(data)).join(''),
                data: JSON.stringify(data),
                success: function (data) {
                    that.attr('sid', JSON.parse(data).rm.sid);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    that.loginErrorCallback()
                }

            })
        }
    })
})
