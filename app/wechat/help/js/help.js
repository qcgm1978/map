/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  help
 * @author wangyonggang qq:135274859
 * @classdesc 更新页面缓存，根据设备动态修改链接地址
 */
void function(){
    var cache = window.applicationCache;
    cache.addEventListener('updateready', cacheUpdatereadyListener, false);
    cache.addEventListener('error', cacheErrorListener, false);
}();
function cacheUpdatereadyListener (){
    window.applicationCache.update();
    window.applicationCache.swapCache();
}
function cacheErrorListener() {
    console.log('site not availble offline')
}
var linkEl = document.getElementById('download');
try {
    if (/Android/i.test(navigator.userAgent)) {
        linkEl.href = "http://intnavapi.changfly.com/d/100/1000/1000/1/";
    } else if (/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
        linkEl.href = "http://intnavapi.changfly.com/d/100/1000/2000/1/";
    }
} catch (e) {
}