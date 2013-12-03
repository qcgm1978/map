/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/3/13
 * Time: 3:44 PM
 * Use:
 */
define(['jquerymx'],function(){
    $.Controller('MaskLayer', {
        '#tmc_btn touchstart': function (el, ev) {
            $(el).data('press', 'press');
        },
        '#tmc_btn touchend': function (el, ev) {
            if ($(el).data('press') == 'press') {
                $(el).removeData('press');
                $(el).toggleClass("active");
                $(el).hasClass('active') ? mapHandler.addTmcLayer() : mapHandler.removeTmcLayer();
            }
        }
    });
    return MaskLayer;
})
