/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-7-16 下午1:46
 * @version V1.0
 * Modification History:
 */
define(['tools'], function () {
    Util.common('Util.common', {
        /**
         The method is to conversion unit
         @method unit_conversion.
         @param m number
         @param decimal number
         @return {String}
         **/
        unit_conversion: function (m, decimal) {
            if (m == Infinity) {
                return "未知";
            }
            else {
                //number的字符串表示，不采用指数计数法，小数点后有固定的digics位数字。如果 必要，该数字会被舍入，也可以用0补足，以便它达到指定的长度。
                var k = 0;
                //如果大于等于100公里，不显示小数
                if (m / 1000 >= 100) {
                    k = (m / 1000).toFixed(0);
                }
                else {
                    k = (m / 1000).toFixed(1);
                }
                return k;
            }
        },
        routeUnitConversion: function (m, decimal) {
            if (m == Infinity)
                return "未知";
            if (m < 1000) {
                if (m >= 1) {
                    return parseInt(m) + '米';
                } else {
                    return '1米';
                }
            }
            else {
                //number的字符串表示，不采用指数计数法，小数点后有固定的digics位数字。如果 必要，该数字会被舍入，也可以用0补足，以便它达到指定的长度。
                var k = 0;
                //如果大于等于100公里，不显示小数
                if (m / 1000 >= 100) {
                    k = (m / 1000).toFixed(0);
                }
                else {
                    k = (m / 1000).toFixed(1);
                }
                return k + '千米';
            }
        }
    });
})