/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  Toolbar
 * @author wangyonggang qq:135274859
 * @classdesc 显示路书页面路书信息
 */




define(['jquerymx'], function () {
    /**
     A utility that Toolbar event controller
     @class Toolbar
     @constructor
     **/

    $.Controller('Toolbar', {
        $route: $("#route"),
        tabsContent_table_content: $('#route .tabsContent_table_content'),
        scroll_first: $('#scroll_first'),
        scroll_second: $('#scroll_second'),
        scroll_first_table: $('#scroll_first table'),
        scroll_second_table: $('#scroll_second table'),
        mapHandle: null,
        /**
         Method for automatic call instantiated
         @method init.
         **/
        init: function () {
            this.mapHandle = this.options.mapHandle;
            this.infoHeight = $('#link_bar').height();
            this.headHeight = $('#route .header').height();
            this.theadHeight = $('#tabsContent thead:first').height();
        },
        /**
         Method for show route info
         @method showRouteInfo.
         **/
        showRouteInfo: function (routeObj) {
            if (this.tabsContent_table_content.find('tr').length == 0) {
                routeObj.attr('rout_type', 4);
                var $rapidRoute = routeObj.showRoadSegInfo();
                routeObj.attr('rout_type', 0);
                var $normalRoute = routeObj.showRoadSegInfo();
                this.scroll_first_table.append($rapidRoute);
                this.scroll_second_table.append($normalRoute);
            }
            this.$route.css({top: '100%', height: '0.1%', visibility: 'visible'});
            var endHeight = $(document.body).height() - this.infoHeight;

            util_common.animateDisplayLayer(this.$route, 0, endHeight);
            if (this.mapHandle.curDisplayPath == 4) {
                routeObj.attr('curDisplayPath', 'A');
            } else {
                routeObj.attr('curDisplayPath', 'B');
            }
        },
        /**
        set scroll ele height
         @method setScrollEleHeight.
         @param arr Array
         **/
        setScrollEleHeight:function(arr){
            var height = $(document.body).height();
            for(var i =0;i<arr.length;i++){
                height = height - arr[i];
            }
            this.scroll_first.height(height);
            this.scroll_second.height(height);
        },
        'span touchend': function (el, ev) {
//        location.hash = '#routeInfo';
            this.showRouteInfo(this.options.routeObj);
        }
    });

})