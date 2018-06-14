(function (window, document, $) {
    /**___________________________________________________*/
    var App = new Application();
    App.init();
    App.extend({
        handlers: {},
        sliders: {
            billboard: {
                el: '.owl--billboard-slider',
                options: {
                    items: 1,
                    nav: false,
                    dots: true,
                    autoplay: true,
                    loop: true
                }
            }
        },
        resize: function (resize) {

        },
        scroll: function (scroll) {

        },
        ready: function () {
            var self = this;
            self.initSliders();
            self.regHandlers(this.handlers);
            $('[height-align-row]').each(function (index) {
               var $items = $(this).find('[height-align-item]');
                self.helpers.heightAlign($items);
            });
        }
    });

    /**_______________________________*/
    $(document).ready(function () { App.ready(); });
    $(window).on('scroll', function () {var scroll = $(this).scrollTop(); App.scroll(scroll);});
    $(window).on('resize', function () { var resize = $(this).width(); App.resize(resize); });

})(window, document, jQuery);