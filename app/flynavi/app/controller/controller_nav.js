/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 3/26/13
 * Time: 4:38 PM
 * Use:
 */

require.config({
    baseUrl: 'scripts',
    paths: {
        jquery: '../bower_components/jquery/jquery',
        jqueryMigrate: '../bower_components/jquery-migrate/jquery-migrate',
        jquerymx: '../bower_components/jquerymx/jquerymx',
        tools: "util/tools",
        mapUtil: "util/mapUtil"
    },
    shim: {
        jqueryMigrate: {
            deps: ['jquery']
        },
        jquerymx: {
            deps: ['jquery']
        }
    }
});
require(['tools', 'mapUtil'], function () {
    var url = location.href,
        addressHandler = new SharedAddressHandler(url);

    url = addressHandler.buildRedirectAddress();
    var handler = new SharedInfoHandler(url);
    handler.verifySharedInfo();
    handler.tryOpenSoftware();
    handler.redirectStartPage();


    function SharedAddressHandler(url) {
        var that = this;
        this.url = url;
// insert start:        to delete when building
        $.ajax(
            {
                url: "flynavi/app/controller/test-data-emulation.js",
                async: false
            }
        ).done(function () {
                that.url = emulateData(url, _verifySharedInfoValidity)
            });
// insert end
        this.buildRedirectAddress = function () {
            return that.url
                .replace(/navi\.htm/, '')//index.html file name not occurs in formal enviroment
                .replace(/(start\.html)?\?/, "start.html?");

        };

        function _verifySharedInfoValidity(url) {
            return /lng/.test(url) && /lat/.test(url) && /name/.test(url);
        }
    }

    function SharedInfoHandler(url) {
        var publicModel = new PublicModel();
        this.url = url;
        var util_common = new Util.common(),
            that = this;
        this.shareInfo = util_common.parseUrl(this.url);
        function _redirect() {
            location.href = that.url;
        }

        function _verifyInfoVal(shareInfo) {
            return util_common.judgeVal(shareInfo.name) && util_common.judgeVal(shareInfo.lng) && util_common.judgeVal(shareInfo.lat)
        }

        function _isAddressVal(url) {
            return /address\=.+/.exec(url);
        }

        function _tryOpenFlySoftware(appUri) {
            document.location = appUri;
            setTimeout(function () {
                _redirect();
            }, 1000);
        }

        this.verifySharedInfo = function () {
            if (!_verifyInfoVal(this.shareInfo)) {
                //todo 等待产品需求
//                    alert('飞享信息错误');
            }

        };
        this.tryOpenSoftware = function () {

            if (!publicModel.isIOS()) {
                return;
            }
            var addressStr = this.shareInfo.address ? '"address":"' + this.shareInfo.address + '",' : '';
            var infoJson = '{' +
                addressStr +
                '"name":"' +
                this.shareInfo.name +
                '","lng":' +
                this.shareInfo.lng +
                ',"lat":' +
                this.shareInfo.lat +
                ',"source":' +
                this.shareInfo.source +
                ',"type":' +
                this.shareInfo.type +
                ',"leaveMessage":"' +
                this.shareInfo.leaveMessage +
                '"}';
            var isHd = ''
            if (/ipad/i.test(navigator.userAgent)) {
                isHd = 'HD'
            }
            var appStoreUri = encodeURI('Raxtone-Flynavi' + isHd + '://{"LaunchType":' + infoJson + '}');
            _tryOpenFlySoftware(appStoreUri);
        };
        this.redirectStartPage = function () {
            if (publicModel.isIOS()) {
                return;
            }
            _redirect();
        };

    }

});