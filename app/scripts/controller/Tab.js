/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/3/13
 * Time: 4:04 PM
 * Use:
 */
define(['jquerymx'],function(){
    $.Controller('Tab', {
        init: function () {
        },
        "li touchend": function (el, ev) {
            var routeObj = this.options.routeObj;
            routeObj.attr('curDisplayPath', el.attr('data-tab'));
        },
        '.toolbar touchend': function () {
            $('#route').animate({top: '100%', height: '0.1%'}, 'slow', function () {
                $('#route').css('visibility', 'hidden');
            });
//        location.hash = "#requestPath";
        }
    });
    return Tab;
})
