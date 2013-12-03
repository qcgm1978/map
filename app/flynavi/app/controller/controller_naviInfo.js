/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-7-11 下午4:00
 * @version V1.0
 * Modification History:
 */
define(['fastdom', 'jquerymx'], function (fastdom) {
    $.Controller('NaviInfo', {
            defaults: {
            }
        },
        {

            init: function () {
                this.$route_tmc = $('#path_info .route_tmc_container');
                this.$route_normal = $('#path_info .route_normal_container');
            },
            '.route_tmc_container touchend': function (el) {
                if (el.hasClass('unselect')) {
                    this.$route_normal.toggleClass('unselect select');
                    el.toggleClass('unselect select');
                    mapHandler.setPathPileOrder();
                }
            },
            '.route_normal_container touchend': function (el) {
                if (el.hasClass('unselect')) {
                    this.$route_tmc.toggleClass('unselect select');
                    el.toggleClass('unselect select');
                    mapHandler.setPathPileOrder();
                }
            },
            failMethod: function () {
                $('#path_info .loadingProgressBar:first img').attr('src', 'flynavi/resources/images/loading-b1.png');
                $('#path_info .loadingProgressBar:first span').text('加载失败！等会再试^^');
                $('#path_info .loadingProgressBar:last img').attr('src', 'flynavi/resources/images/loading-b1.png');
            },
            requestTmcFail: function () {
                $('#path_info .loadingProgressBar:first img').attr('src', 'flynavi/resources/images/loading-b1.png');
                $('#path_info .loadingProgressBar:first span').text('加载失败！等会再试^^');
            },
            requestNormalFail: function () {
                $('#path_info .loadingProgressBar:last img').attr('src', 'flynavi/resources/images/loading-b1.png');
            },
            showNotSupportPrediction: function () {
                $('#path_info .loadingProgressBar:first').hide();
                $('#path_info .notSupportPredictionTips').css('display', ' -webkit-box');
                $('#path_info .loadingProgressBar:last img').attr('src', 'flynavi/resources/images/loading-b1.png');
            },
            showProgressBar: function () {
                $('#path_info .loadingProgressBar:first img').attr('src', 'flynavi/resources/images/loading-a1.gif');
                $('#path_info .loadingProgressBar:last img').attr('src', 'flynavi/resources/images/loading-a1.gif');
                $('#path_info .loadingProgressBar:first span').text('加载中...');
                $('#path_info .loadingProgressBar').css('display', '-webkit-box');
                $('#path_info .prediction_model_container').css('display', 'none');
            },
            restorationIni: function () {
                if (this.$route_tmc.hasClass('unselect')) {
                    this.$route_tmc.toggleClass('select unselect');
                    this.$route_normal.toggleClass('select unselect');
                }
            },
            showTmcData: function (newVal) {
                if (typeof  newVal === 'undefined') {
                    return;
                }
                fastdom.write(function () {

                    $('#tmc_withTime_one').text(util_common.formatMinute(Math.round(newVal.timeExtend10 / 60)));
                    $('#tmc_withTime_two').text(util_common.formatMinute(Math.round(newVal.timeExtend20 / 60)));
                })
                $('.loadingProgressBar:first').hide();
                $('#path_info .prediction_model_container:first').show();
                var sid = requestRaxtone.getSid();
                requestRaxtone.requestRaxtoneRoutePre(sid, 0)
            },
            showNormalData: function (newVal) {
                if (typeof  newVal === 'undefined') {
                    return;
                }
                fastdom.write(function () {
                    $('#normal_withTime_one').text(util_common.formatMinute(Math.round(newVal.timeExtend10 / 60)));
                    $('#normal_withTime_two').text(util_common.formatMinute(Math.round(newVal.timeExtend20 / 60)));
                })
                $('.loadingProgressBar:last').hide();
                $('#path_info .prediction_model_container:last').show();
            }
        });
});