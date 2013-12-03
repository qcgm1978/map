/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-7-18 上午10:39
 * @version V1.0
 * Modification History:
 */
//history event controller using hash
define(['jquerymx'], function () {
        $.Controller("FlySharedHistory", {
        defaults: {
            ini: true
        }
    }, {
        init: function () {
        },
        //called when hash = #share
        share: function () {
            if (this.options.ini) {
                this.options.ini = false;
                return;
            }
            common.recoverEleState();
            mapHandler.recoverMapState();
        },
        //    todo only keep map init state, cancel comments if all states valid
        requestPath: function () {
            this.options.ini = false;
        },
        // listen for history changes
        "{window} hashchange": function (ev) {
            try {
                var hash = window.location.hash.slice(1);
                this[hash]();
            } catch (e) {
                console.log(e.stack)
                this.share()
            }
        }
    });
    return FlySharedHistory;
});