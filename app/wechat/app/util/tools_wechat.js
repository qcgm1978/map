/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-6-28 上午11:14
 * @version V1.0
 * Modification History:
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
