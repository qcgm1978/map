/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 8/5/13
 * Time: 4:50 PM
 * Use:
 */
define([], function () {
    var API_VERSION = 1.2  ,
        API_KEY = '0aa17a679101794a2bc8979b3eb332a7'
//    todo charset no set, perhaps no needed
//    @example <script src="http://webapi.amap.com/maps?v=1.2&key=0aa17a679101794a2bc8979b3eb332a7" charset="utf-8"></script>
    var mapApiUrl =
        'http://webapi.amap.com/maps?v=' +
            API_VERSION +
            '&key=' +
            API_KEY;
//    requirejs.config({
//        enforceDefine: true,
//        paths: {
//            mapApi: mapApiUrl
//        }
//    });
    require(['flynavi/app/app_flynavi.js'])
//    require(
//        ['mapApi'],
//        function () {
//            require(['flynavi/app/app_flynavi.js'])
//        }
//        ,
//        function (err) {
//            alert( '亲，需要网络，快检查一下^^')
//        })
})
