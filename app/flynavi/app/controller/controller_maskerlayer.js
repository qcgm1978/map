/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  MaskLayer
 * @author wangyonggang qq:135274859
 * @classdesc 根据元素状态动态修改动态图层按钮背景，并添加或删除tcmLayer
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

