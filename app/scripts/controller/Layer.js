/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/3/13
 * Time: 2:32 PM
 * Use:
 */
define(['jquerymx'], function () {
    /**
     A utility that simulation system of prompt box
     @class Layer
     @constructor
     **/
    $.Controller('Layer',
        {
            /**
             Method for automatic call instantiated
             @method init.
             **/
            init: function () {
                this.element.find('.layer-sub-content').html(this.options.msg);
            },
            '.layer-sub-button-greed touchstart': function (el, ev) {
                el.addClass('active');
                el.data('press', 'press');
            },
            '.layer-sub-button-greed touchend': function (el, ev) {
                if (el.data('press') == 'press') {
                    el.removeData('press');
                    el.removeClass('active');
                    window.location.reload();
                }
            },
            '.layer-sub-button-red touchstart': function (el, ev) {
                el.addClass('active');
                el.data('press', 'press');
            },
            '.layer-sub-button-red touchend': function (el, ev) {
                if (el.data('press') == 'press') {
                    el.removeData('press');
                    el.removeClass('active');
                    this.element.fadeOut("slow");
                    $('#map_layer').toggleClass('map_layer');
                }
            },
            /**
             *show a simulation system of prompt box
             *
             * @method show.
             */
            show: function () {
                $('#map_layer').toggleClass('map_layer');
                this.element.fadeIn("fast");
            }
        });
    return Layer;
})