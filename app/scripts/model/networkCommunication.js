/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/4/13
 * Time: 5:31 PM
 * Use:
 */
define(['jquerymx'], function () {
    /**
     A utility that net service model
     @class netService
     @constructor
     **/
    $.Model('MapModel.netService', {
        /**
         * netService property description.
         * @property  prompt_no_net
         * @property  isJsApi
         * @type {Object}
         * @default ""
         */
        defaults: {
            //     todo prompt contents not update, it should include two conditions:
//     1, gps service not enabled
//     2, device or browers in the device not support to obtain gps info
            prompt_no_net: '亲，需要网络，快检查一下^^'
        }
    }, {
        /**
         Method for automatic call instantiated
         @method init.
         **/
        init: function () {

        },
        /**
         network status for chrome or safari(mobile environment) and browser's offline mode for firefox and ie
         @method isConnectLocalNet.
         @return {Boolean}
         **/
        isConnectLocalNet: function () {
            return navigator.onLine;
        },
        /**
         Whether the network connection
         @method isConnected.
         @return {Boolean}
         **/
        isConnected: function () {
            return this.hasJsApi() && this.isConnectLocalNet();
        },
        hasJsApi: function () {
            return typeof AMap !== 'undefined'
        },
        /**
         Pop-up boxes
         @method promptNoNet.
         **/
        promptNoNet: function () {
            alert(this.prompt_no_net);

        }
    });
})