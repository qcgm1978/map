/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 8/5/13
 * Time: 1:28 PM
 * Use:
 */
/*
* 监听本地缓存文件是否更新, can't cache!
*
* @module no name
* */
define([], function () {
    function updateCache() {
        applicationCache.addEventListener('updateready', function (e) {
            applicationCache.swapCache();
            location.reload()
        }, false);
    }
    updateCache()
    require(['scripts/lib/mapApi.js'])
})
