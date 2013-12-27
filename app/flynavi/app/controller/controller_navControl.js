/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  NavControl
 * @author wangyonggang qq:135274859
 * @classdesc 顶部导航控制页面流程
 */
define(['jquerymx'],function(){


$.Controller('NavControl', {
        defaults: {
            $a_inav:$('#header .a-inav'),
            $c_inav:$('#header .c-inav'),
            $e_inav:$('#header .e-inav')
        }
    },
    {
        init: function () {
            this.toolbarNav = this.options.toolbarNav;
        },
        '.back touchstart': function (el) {
            el.addClass('active');
        },
        '.back touchend': function (el) {
            el.removeClass('active');
            location.hash='share';
        },
        '.route-button touchstart': function (el) {
            el.addClass('active');
        },
        '.route-button touchend': function (el) {
            el.removeClass('active');
            this.options.$c_inav.toggleClass('none');
            this.options.$e_inav.toggleClass('none');
            this.toolbarNav.showRouteInfo();
        },
        showCinav:function(){
            this.options.$a_inav.toggleClass('none');
            this.options.$c_inav.toggleClass('none');
        },
        showAinav:function(){
            $("#header .header_toolbar:not('.none')").toggleClass('none');
            this.options.$a_inav.toggleClass('none');
        }
    });

})