/**
 * @COPYRIGHT Shanghai RaxTone-Tech Co.,Ltd.
 * @module  PoiListController
 * @author wangyonggang qq:135274859
 * @classdesc poi列表控制器
 */
$.Controller('PoiListController', {
    defaults: {
        poiScroll:null,
        prev:$('#poi_div').find('.poi-page-prev'),
        next:$('#poi_div').find('.poi-page-next'),
        control:$('#poi_div').find('.poi-list-control'),
        $zoomOut :  $('#zoom_out'),
        $zoomIn :$('#zoom_in'),
        $positioning : $('#positioning'),
        defaultHeight:112
    }
}, {
    init: function () {
        this.options.poiScroll = new iScroll('poi-list', {
            snap: false,
            hScrollbar: false,
            vScrollbar: false,
            useTransition: true,
            hScroll: false,
            bounce: false,
            zoom: false,
            momentum:true,
            onScrollMove: function () {

            },
            onScrollEnd: function () {

            }
        });
        this.refreshScroll('main');
    },
    '.poi-page-prev touchstart': function (el, ev) {
        el.toggleClass('active');
    },
    '.poi-page-prev touchend': function (el, ev) {
        el.toggleClass('active');
        var page = mapPoiIns.getPageNum();
        if(page>1){
            this.getPoiList(page-1);
        }
    },
    '.poi-page-next touchstart': function (el, ev) {
        el.toggleClass('active');
    },
    '.poi-page-next touchend': function (el, ev) {
        el.toggleClass('active');
        if (mapPoiIns.isMorePoi()) {
            var page = mapPoiIns.getPageNum();
            this.getPoiList(page+1);
        }
    },
    '.poi-list-control touchstart': function (el, ev) {
        el.toggleClass('active');
    },
    '.poi-list-control touchend': function (el, ev) {
        el.toggleClass('active openList');
        this.element.toggleClass('shrink');
        this.setUi()
    },
    getPoiList: function (page) {
         mapPoiIns.getPage(page);
    },
    poiListHandler: function (poiListObj) {
        var $poiListTable = $('#poi-list table'),that = this,
            $tbody = $('<tbody></tbody>'), icons = [];
        $.each(poiListObj, function (i, n) {
            icons[i] = 'icons' + i;
            var name = n.name,
                address = n.address,
                tel = n.tel,
                x = n.x,
                y = n.y;
            var $name = $('<p class="name"/>').html(name),
                $address = $('<p class="address"/>').html(address),
                $tel = $('<p class="tel"/>').html(tel),
                $tr = $('<tr><td></td><td ></td><td></td></tr>'),
                $div=$('<div></div>').addClass(icons[i]+' bg_sprite iconWap');
            $tr.find('td').eq(0).append($div);
            $tr.find('td').eq(1).append($name).append($address).append($tel);
            $tr.find('td').eq(2).addClass( 'go bg_sprite');
            $tr.attr({'x':x,'y':y});
            $tr.bind('click',function(){
                if(that.isAnimated()) return false;
                mapHandler.setInfoWindowAndCenter({lng:x, lat:y, name:name,address:address});
            });
            $tbody.append($tr);
        })
        $poiListTable.empty().append($tbody);
        if(this.element.hasClass('shrink')){
            this.options.control.trigger('touchstart');
            this.options.control.trigger('touchend');
        }
        this.setPageControl();
        this.refreshScroll('poi_div');
    },
    isAnimated:function(){
        if(this.element.height()<this.options.defaultHeight&&this.element.height()>0){
            return true;
        }
        return false;
    },
    refreshScroll:function(el){
        var that = this;
        void function(){
            if($('#'+el).is(':visible') && that.element.height()>=that.options.defaultHeight){
                that.options.poiScroll.refresh();
            }else{
                setTimeout( arguments.callee,500);
            }
        }();
    },
    setUi:function () {
        if(this.element.hasClass('shrink')){
           this.options.$zoomOut.css({'bottom':  parseFloat(this.options.$zoomOut.css('bottom')) - 114});
           this.options.$zoomIn.css({'bottom': parseFloat(this.options.$zoomIn.css('bottom')) - 114});
           this.options.$positioning.css({'bottom':  parseFloat(this.options.$positioning.css('bottom')) - 114});
        }else{
            this.options. $zoomOut.css({'bottom':  parseFloat(this.options.$zoomOut.css('bottom')) + 114});
            this.options.$zoomIn.css({'bottom':  parseFloat(this.options.$zoomIn.css('bottom')) + 114});
            this.options.$positioning.css({'bottom':  parseFloat(this.options.$positioning.css('bottom')) + 114});
        }

    },
    setPageControl:function(){
        var page = mapPoiIns.getPageNum();
        if(page==1){
            this.options.prev.css('background-position','0 -90px');
        }else{
            this.options.prev.css('background-position','0 -58px');
        }
        if (!mapPoiIns.isMorePoi()) {
            this.options.next.css('background-position','-220px -90px');
        }else{
            this.options.next.css('background-position','-90px -58px');
        }
    }
});