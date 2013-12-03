/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-7-16 上午9:48
 * @version V1.0
 * Modification History:
 */
define(['jquerymx'],function(){
    $.Controller('MaskLayer', {
        '#tmc_btn touchstart': function (el, ev) {
            /*  el.addClass('active');*/
            var $el=$(el);
            $el.data('press', 'press');
            if( $el.hasClass('active')){
                $el.css('background','url(flynavi/resources/images/public.png) -46px -179px');
            }else{
                $el.css('background','url(flynavi/resources/images/public.png) -46px -224px');
            }
        },
        '#tmc_btn touchend': function (el, ev) {
            var $el=$(el);
            if($el.hasClass('active')){
                $el.css('background','url(flynavi/resources/images/public.png) -1px -224px');
                $el.removeClass('active');
                mapHandler.removeTmcLayer()
            }else{
                $el.css('background','url(flynavi/resources/images/public.png)  0px -180px');
                $el.addClass('active');
                mapHandler.addTmcLayer()
            }
        }
    });
    return MaskLayer;
})

