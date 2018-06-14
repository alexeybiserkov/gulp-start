(function ($) {
    function Application() {};
    Application.prototype.badBrowser = false;
    Application.prototype.handlers = {};
    Application.prototype.checkBadBrowser = function () {
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            $('html').addClass('badBrowser');
            return this.badBrowser = true;
        } else {
            return this.badBrowser = false;
        }
    };
    Application.prototype.init = function () {
        this.checkBadBrowser();
    };
    Application.prototype.regHandlers = function (obj) {
        for (var key in obj) {
            var el = key.split(':')[0];
            var event = key.split(':')[1];
            var func = obj[key];
            $(document).on(event, el, func);
            if (event === 'click' && this.badBrowser) $(el).attr('onclick', "void(0)"); //Fix event bug for IOS
        }
    };
    Application.prototype.extend = function (obj) {
        if (typeof obj === 'object' && !!obj.length) return console.error('Application extend error: type must be object');
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) this[key] = obj[key];
        }
    };
    Application.prototype.getCookie = function (name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : false;
    };
    Application.prototype.setCookie = function (name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
        $('body').trigger('set_cookie');
    };
    Application.prototype.addToBuffer = function (el, callback) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(el);
        window.getSelection().addRange(range);
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            callback(msg);
        } catch (err) {
            console.error('Oops, unable to copy');
        }
        window.getSelection().removeAllRanges();
    };
    Application.prototype.initSliders = function () {
        var options = {driver: 'owl', condition: function () { return true;}};
        var sliders = this.sliders || {};
        for (var name in sliders) {
            var slider = sliders[name];
            var driver = slider.driver || options.driver;
            var condition = slider.condition || options.condition;
            try {
                switch (driver) {
                    case 'slick' :
                        if( condition() ) $(slider.el).slick(slider.options);
                        break;
                    case 'owl' :
                        if( condition() ) $(slider.el).owlCarousel(slider.options);
                        break;
                    default:
                        console.warn('Slider plugin: ' + driver + ' --- app doesn\'t know how to run slider with ' + driver + ' driver');
                        break;
                }
            } catch (err) {
                console.log('init Slider error: ' + err.message);
            }
        }
    };
    Application.prototype.helpers = {
        detectMaxHeight: function ($array) {
            var max = 0;
            $array.each(function () {
                var height = parseInt( $(this).css('height') );
                if (height > max) max = height;
            });
            return max;
        },
        heightAlign: function ($array) {
            var max = this.detectMaxHeight($array);
            $array.css('minHeight', max);
        },
        replaceImage: function( $imgs ){
            $.each( $imgs, function(){
                var $img = $(this);
                if ( $img.hasClass('replaced') ) return;
                var src = $img.attr('src');
                $img.addClass('replaced').hide().wrap('<div class="__replace_image" style="background-image: url('+ src +')"></div>');
            });
        }
    };
    window.Application = Application;
})(jQuery)