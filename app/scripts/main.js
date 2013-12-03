//define([], function () {


var requireConfig = {
    baseUrl: 'scripts',
    paths: {
//            todo use jsonp definition to refer map api http://requirejs.org/docs/api.html#jsfiles
//            mapApi:"http://webapi.amap.com/maps?v=1.2&key=0aa17a679101794a2bc8979b3eb332a7",
        jquery: '../bower_components/jquery/jquery',
        jqueryMigrate: '../bower_components/jquery-migrate/jquery-migrate',
        jquerymx: '../bower_components/jquerymx/jquerymx',
        tools: "util/tools",
        mapUtil: "util/mapUtil",
        tbt: 'lib/tbt',
        toolBar: 'controller/Toolbar',
        Layer: 'controller/Layer',
        map: 'controller/Map',
        mapHandler: 'model/mapHandler',
        webRoute: 'lib/webroute',
        iScroll: '../bower_components/iScroll4.2.5/iscroll',
        app: 'app',
        maskerLayer: 'controller/MaskerLayer',
        tab: 'controller/Tab',
        link: 'controller/Link',
        pathDrawing: 'model/pathDrawing',
        route: 'model/routeInfo',
        networkDetect: 'model/networkCommunication',
        historyController: 'controller/historyController'
    },
    shim: {
        jqueryMigrate: {
            deps: ['jquery']
        },
        jquerymx: {
            deps: ['jqueryMigrate']
        },
        toolBar: {
            deps: ['tools']
        },
        mapHandler: {
            deps: ['jquerymx', 'mapModel']
        },
        tbt: {
            deps: ['jquerymx', 'webRoute']
        },
        app: {
            deps: [/*'mapApi',*/'historyController', 'controllerMap', 'Layer', 'mapHandler', 'tools', 'map', 'maskerLayer', 'tab', 'link', 'toolBar', 'route', 'networkDetect']
        }
    }
};

function extendObj(objBase, objExtend) {
    for (var p in objExtend) {
        if (objExtend[p] instanceof Object) {
            if (typeof objBase[p] === 'undefined') {
                objBase[p] = objExtend[p]
                continue;
            }
            arguments.callee(objBase[p], objExtend[p])
            continue;
        }
        objBase[p] = objExtend[p]
    }
}
function setAppDependencies(arrModules) {
    var deps = requireConfig.shim.app.deps;
    deps = deps.concat(arrModules);
    return deps;
}
//    return {
//        requireConfig: requireConfig,
//        extendObj: extendObj
//    };
//
//})