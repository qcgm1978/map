/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  broadcast
 * @author wangyonggang qq:135274859
 * @classdesc 根据url显示数据
 */
function parseUrl(url) {
    var str = decodeURI(url),
        reg = /.*\?(.*)/;
    var match = /.*\?(.*)/.exec(str);
    if (match == null) {
        return null;
    }
    var arr = match[1].split('&'),
        obj = {};
    for(var n in arr){
        var arrItem = arr[n].split('=');
        obj[arrItem[0]] = arrItem[1];
    }
    return obj;

}
function checkNum(num){
    return Number(num)<10?'0'+num:num;
}
function showTime(time){
    var date = new Date(Number(time)); //日期对象
    var now = "";
    now = date.getFullYear()+"-";
    now = now + checkNum((date.getMonth()+1))+"-";//取月的时候取的是当前月-1如果想取当前月+1就可以了
    now = now + checkNum(date.getDate())+" ";
    now = now + checkNum(date.getHours())+":";
    now = now + checkNum(date.getMinutes());
    /*now = now + checkNum(date.getSeconds())+"";*/
    return now;
}
var broadcastObj = parseUrl(location.href),
    boardPicId = document.getElementById('boardPicId'),
    broadcastTitle = document.getElementById('broadcast-title'),
    broadcastCurrentTime = document.getElementById('broadcast-currentTime'),
    boardPicSrc ="http://testwww.flynavi.cn/openapi/weixin_hz/img/watermarkBoard.pic?boardPicId=";
try{
    boardPicId.innerHTML ='<img src="'+boardPicSrc+broadcastObj.boardPicId+'">';
    broadcastTitle.innerHTML = broadcastObj.title;
    broadcastCurrentTime.innerHTML = showTime(broadcastObj.currentTime);
} catch (e){
    console.log(e.message);
}
