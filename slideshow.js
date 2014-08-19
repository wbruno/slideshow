/**
 * @file slideshow.js
 * @author William Bruno
 * @date 2013-05-25
 */
var adcast = (function(window, document) {
    "use strict";
    /*jslint plusplus: true, browser: true */
    var module = {
        timer : 0,
        atual : 0,
        max   : 1,
        delay : 4000,
        config : function(config) {
            module.$adcastWrap  = config.adcasts[0].parentNode;
            module.$adcasts     = [].slice.call(config.adcasts);
            module.$pagers      = [].slice.call(config.pagers);
            module.onChange     = config.onChange;
            module.pagersClick  = config.pagersClick || false;

            module.max = module.$adcasts.length;
        },
        active : function() {
            var i = module.atual;
            module.$adcasts[i].classList.add('is-active');
            module.$pagers[i].classList.add('is-active');
            module.$adcastWrap.className = 'adcast-item-' + i;

            if (module.onChange) {
                module.onChange(i);
            }
        },
        none : function() {
            module.$adcasts.forEach(function($adcast) {
                $adcast.classList.remove('is-active');
            });
            module.$pagers.forEach(function($pager) {
                $pager.classList.remove('is-active');
            });
        },
        next : function() {
            var i = module.atual;

            module.none();
            module.active();
        },
        _setAtual : function(i) {
            if (i < 0) {
                module.atual = module.max - 1;
            } else {
                module.atual = i < module.max ? parseInt(i, 10) : 0;
            }
        },
        auto : function() {
            module.timer = window.setInterval(function() {
                module._setAtual(module.atual + 1);
                module.next();
            }, module.delay);
        },
        _pause: function() {
            window.clearInterval(module.timer);
            window.clearTimeout(module.tot);
        },
        _onPagersClick : function($pager) {
            $pager.addEventListener('click', function() {
                var $this = this,
                    i = $this.getAttribute('data-adcast');

                module._pause();
                module.tot = window.setTimeout(module.auto, module.delay / 2);

                module._setAtual(i);
                module.next();
            });
        },
        _onPagersHover : function($pager) {
            $pager.addEventListener('mouseover', function() {
                var $this = this,
                    i = $this.getAttribute('data-adcast');

                module.atual = i;
                window.clearInterval(module.timer);
                module.none();
                module.active();
            });
            $pager.addEventListener('mouseout', function() {
                var $this = this,
                    i = $this.getAttribute('data-adcast');

                module._setAtual(i);
                module.auto();
            });
        },
        _keyboard : function() {
            document.addEventListener('keydown', function(event){
                var i;
                if(event.keyCode == 39) { //right
                    i = module.atual + 1;
                }
                if(event.keyCode == 37) { //left
                    i = module.atual - 1;
                }

                module._setAtual(i);
                module.next();
            });
        },
        events : function() {
            module.$pagers.forEach(function($pager) {
                if (module.pagersClick) {
                    module._onPagersClick($pager);
                } else {
                    module._onPagersHover($pager);
                }
            });
            module._keyboard();
        },
        init : function(config) {
            module.config(config);

            if (!module.max || module.max === 1) {
                return;
            }

            module.next();
            module.auto();
            module.events();
        }
    };

    return {
        init : module.init
    };

}(window, document));
