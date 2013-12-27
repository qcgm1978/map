/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  ToolbarNav
 * @author wangyonggang qq:135274859
 * @classdesc 获取路书页面信息（主干路，次要路，红绿灯）并显示在路书页面
 */
define(['jquerymx'],function(){
    Toolbar('ToolbarNav',{
        init:function(){
            this._super();
            this.$mainway= $('#highway');
            this.$secondaryway= $('#trunk');
            this.$trafficlights=$('#trafficlights');

        },
        showRouteInfo:function(){
            this._super(this.options.routeObj);
            if (this.mapHandle.curDisplayPath == 4) {
                this.$mainway.text(requestPath.getMainRoadNum(4));
                this.$secondaryway .text(requestPath.getSecondaryRoadNum(4));
                this.$trafficlights.text(requestPath.getRouteLights(4));
            }else{
                this.$mainway.text(requestPath.getMainRoadNum(0));
                this.$secondaryway .text(requestPath.getSecondaryRoadNum(0));
                this.$trafficlights.text(requestPath.getRouteLights(0));
            }
        },
        //此处勿删
        'span touchend': function (el, ev) {
//        location.hash = '#routeInfo';
          /*  this.showRouteInfo(this.options.routeObj);*/
        }
    });
})