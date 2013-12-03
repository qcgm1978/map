/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 5/29/13
 * Time: 1:19 PM
 * Use:
 */
var modulesWechat = ['poiModel', 'controllerList', 'toolsWechat','pathInfo'];
var deps = setAppDependencies(modulesWechat);
var obj = {
    paths: {
        pathInfo: '../wechat/app/controller/PathInfo',
        maskerLayer: 'controller/MaskerLayer',
        mapModel: '../wechat/app/model/map-model-wechat',
        poiModel: '../wechat/app/model/poi-model',
        controllerMap: '../wechat/app/controller/controller_poi',
        controllerList: '../wechat/app/controller/controller_list',
        toolsWechat: '../wechat/app/util/tools_wechat'
    },
    shim: {
        mapModel: {
            deps: ['jquerymx', 'mapUtil', 'iScroll', 'tbt']
        },
        poiModel: {
            deps: [ 'jquerymx']
        },
        controllerMap: {
            deps: [ 'jquerymx']
        },
        controllerList: {
            deps: ['jquerymx']
        },
        toolsWechat: {
            deps: ['jquerymx', 'tools']
        },
        app: {
            deps: deps
        }
    }
}
extendObj(requireConfig, obj);
require.config(requireConfig);
require(['maskerLayer', 'app'], function () {
    mapHandler
        .bind('shareInfo', function (ev, newVal) {
            this.encapsulateShareInfo();
            this.addLoadMap(newVal);
            this.handleMarkers();
            this.setInfoWindowAndCenter(newVal);
        })
        .bind('curInfo', function (ev, newVal) {
            if ($.isEmptyObject(newVal)) {
                this.addLoadMap(this.defLngLat);
            }
            this.addLoadMap(newVal);
            this.addCurMarker();
            this.moveCurMarker();
            this.rotateCurMarkerOrMap();
            positionStateEnd();
        })
        .bind('hasMap', function () {
            this.bindZoomChangeEve();
            scale.attr('level', this.mapObj.getZoom());
        })
    function searchByInput() {
        var searchButton = $("#search_box").find('.search-button');
        searchButton.on('touchstart', function () {
            $(this).css('background-color', '#2DC01B');
        });
        searchButton.on('touchend touchmove', function () {
            $(this).css('background-color', '');
        });
        $("form").submit(function () {
            var $keyWord = $('#keyword');
            var val = $keyWord.val();
            if ($.trim(val) == '') {
                return false;
            }
            $keyWord.attr('placeholder', val)
            mapPoiIns.routeName = val;
            mapPoiIns.revertPageState()
            mapPoiIns.search();
            return false;
        });
    }

    searchByInput();
    var url = location.href.replace(/#.+$/, '');
    var obj = util_common.parseUrl(url);
    if (obj != null) {
        obj.callback = function poiDataHandler(data) {
            if (typeof poiListController === 'undefined') {
                poiListController = new PoiListController($('#poi_div'));
            }
            poiListController.poiListHandler(data);
            mapHandler.attr('shareInfo', {
                name: data[0].name,
                address: data[0].address,
                lat: data[0].y,
                lng: data[0].x
            });
            followDev.attr('isPollGps', true);
        }
        obj.noDataCallback = function () {
//todo call prompt module
            var promptWords = '未搜到结果，搜索其他地址试试^_^';
            alert(promptWords)
            followDev.attr('isPollGps', true);
        }
        mapPoiIns = new MapModel.mapPoi(obj);
        mapPoiIns.search();
        location.hash = '#share';
        $('#keyword').attr('placeholder', obj.routeName);
    }
    bindFocusEve('input');
    //定位按钮等待状态
    var position_interval = null,
        positionBtnState = false;
    void function () {
        var num = 0;
        if (/Android\s*2\.3/.exec(navigator.userAgent)) {
            $('#positionLight').css('-webkit-backface-visibility', 'visible');
        }
        position_interval = setInterval(function () {
            var angle = 45 * num;
            num++;
            $('#positionLight').css({
                '-webkit-Transform': 'rotate(' + angle + 'deg)'
            })
            if (num == 8) {
                num = 0;
            }
        }, 150);
    }();
    function positionStateEnd() {
        if (positionBtnState) {
            return;
        }
        clearInterval(position_interval);
        $('#positionLight').removeClass('loading').hide();
        positionBtnState = true;
    }
    new MaskLayer($('#mask_layer'));
    new Map($('#map_container'));
    new PathInfo($('#path_info'));
    routeObj = new Route();
    routeObj.attr('totalWidth', ($(document.body).width() - $('.tabsContent_table th').eq(0).width() - $('.tabsContent_table th').eq(2).width()) / 2);
    new Tab($('#route'), {routeObj: routeObj});
    $(window).fly_shared_history({
        routeObj: routeObj,
        toolbar: toolbar
    });
    var toolbar = new Toolbar('.toolbar:first', {
        mapHandle: mapHandler,
        routeObj: routeObj
    }), arr = [];
    arr.push($('#link_bar').height());
    arr.push($('#route .header').height());
    arr.push( $('#tabsContent thead:first').height());
    arr.push( $('#route .route_info').height());
    toolbar.setScrollEleHeight(arr);
});