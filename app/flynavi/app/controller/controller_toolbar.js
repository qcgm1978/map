/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @Title:
 * @Description:
 * @author wangyonggang qq:135274859
 * @date 13-7-12 下午2:32
 * @version V1.0
 * Modification History:
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