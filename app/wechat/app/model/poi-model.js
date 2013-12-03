/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 5/27/13
 * Time: 3:41 PM
 *  Provides map poi handler
 * @module mapPoi
 * Provides search
 *  @class API
 *  @constructor
 */
$.Model('MapModel.mapPoi', {
    defaults: {
        region: 330100,
        number: 30,
        batch: 1,
        curPage: 1,
        list: [],
        listArr: [],
        isRequestedPoi: false
    }
}, {

    init: function (config) {
        this.routeName = config.routeName
        this.callback = config.callback;
        this.noDataCallback=config.noDataCallback
    },
    /**
     * @method 设置POI查询类别、每页数量、页数、范围等（类别无须设置）
     * @return {Object} instance param
     * */
    getPoiOption: function () {
        var option = {
            number: this.number || this.searchNum,
            batch: this.batch,
            range: this.range || 3000,
            sort: 1
        };
        return option;
    },
    search: function () {
        if (typeof this.routeName === 'undefined') {
            return;
        }
        var option = this.getPoiOption(), that = this;
        var poi = new AMap.PoiSearch(option);
        poi.byKeywords(this.routeName, this.region, function (result) {
            that.getSearchResult.call(that, result);
        });
    },
    getSearchResult: function (result) {
        this.total = result.total;
        var searchList = this.getSearchList(result);
        if (!searchList) {
            return;
        }
        this.paging(searchList);
        this.callback(this.getRetData(this.curPage))
    },
    getRetData: function (i) {
        if (i <= this.pageNum) {
            this.curPage = i;
            return this.listArr[i - 1];
        }
    },
    isMorePoi: function () {
        var listArr = this.listArr;
        var num = listArr.length - 1;
        return this.total > num * 10 + listArr[num].length;
    },
    getSearchList: function (result) {
        if (typeof result.list === 'undefined') {
            this.noDataCallback()
            return false;
        }
        this.attr('isRequestPoi', true);
        return result.list;
    },
    paging: function (list) {
        var arr = [],
            that = this,
            len = list.length;
        $.each(list, function (i, n) {
            if (i != 0 && i % 10 == 0) {
                that.listArr.push(arr)
                arr = [];
            }
            arr.push(n);
            if (i == len - 1) {
                that.listArr.push(arr);
                return false;
            }
        });
        this.pageNum = this.listArr.length;
        return this.listArr;
    },
    /*
     * @method get a single page data
     * @param i [int] requested page order
     * @param callbackAsyn [Function] callback when request data again
     * */
    getPage: function (i) {
//if not the last page, return requested data
        if (i <= this.pageNum) {
//        if not more result, ret directly
            this.curPage = i;
            this.callback(this.listArr[i - 1]);
            return;
        }
        if (!this.isMorePoi()) {
//        if not callback param, ret directly
            return;
        }
//        request more data
        this.batch++;
        this.curPage = i;
        this.search();
    },
    getPageNum: function () {
        return this.curPage;
    },
    revertPageState: function () {
        this.curPage = 1;
        this.listArr = [];
    },
    getPrevPage: function (i) {
        return this.listArr[i - 1];
    }
})
;

$.Model('MapModel.UrlDataHandler', {
    defaults: {

    }
}, {

    init: function (result) {
    },
    getData: function () {

    }
})