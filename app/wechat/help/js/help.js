/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-5-23 下午5:10
 * @version V1.0
 * Modification History:
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