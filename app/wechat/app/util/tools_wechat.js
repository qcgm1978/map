/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  Util.common
 * @author wangyonggang qq:135274859
 * @classdesc 提供一些常用方法，如字符串转换，判断是否是微信浏览器，百度浏览器，ios系统
 */
Util.common('Util.common',{
    truncateStr: function (str, maxLength) {

        if (str.length >= maxLength) {
//                changed to a sing ".", "..." orginal, to adjust layout in flynavi project
            return str.slice(0, maxLength - 1) + '.';
        }
        return str;
    },

    isMicroMessengerBrowser:function(){
        return Boolean(/micromessenger/i.exec(navigator.userAgent));
    },
    isNotBaiduBrowser:function(){
        return !Boolean(/baidubrowser/i.exec(navigator.userAgent));
    },
    //操作系统判定
    isIOS: function () {
        var exrep = /mac/i;
        return exrep.test(navigator.userAgent) ? true : false;
    }
});
