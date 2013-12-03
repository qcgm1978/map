/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/3/13
 * Time: 4:07 PM
 * Use:
 */
define(['jquerymx'], function () {
    /**
     A utility that link controller
     @class Link
     @constructor
     **/
    $.Controller('Link',
        {
            /**
             Method for automatic call instantiated
             @method init.
             **/
            init: function () {
                this.isIOS = this.options.isIOS;
            },
            /**
             set link and download url
             @method setUrl.
             **/
            setUrl: function () {
                this.linkUrl = this.isIOS ? 'http://www.flynavi.cn/version/iphone.html' : 'http://www.flynavi.cn/version/android.html';
                this.downloadUrl = this.isIOS ? 'https://itunes.apple.com/cn/app/fei-lu-kuai-dao-hang/id570886583?mt=8' : 'http://www.flynavi.cn/d/1/flynavi.apk';
                $('.instructions a').attr('href', this.linkUrl);
                $('.download a').attr('href', this.downloadUrl);

            },
            '.download touchstart': function (el, ev) {
                el.find('img').css({
                    opacity: '0.7'
                });
            },
            '.download touchend': function (el, ev) {
                el.find('img').css({
                    opacity: '1'
                });
            }
        });
    return Link;
})