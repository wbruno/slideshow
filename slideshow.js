/**
 * @file slideshow.js
 * @author William Bruno
 * @date 2013-05-25
 */
var adcast = (function (window, document) {
    "use strict";
    /*jslint plusplus: true, browser: true */
    var module = {
        timer : 0,
        atual : 0,
        max   : 1,
        delay : 4000,
        config : function (config) {
            module.$adcastWrap  = config.adcasts[0].parentNode;
            module.$adcasts     = [].slice.call(config.adcasts);
            module.$pagers      = [].slice.call(config.pagers);
            module.onChange     = config.onChange;
            module.$prev        = config.prev;
            module.$next        = config.next;
            module.pagersClick  = config.pagersClick || false;

            module.max = module.$adcasts.length;
        },
        infinite : function (i) {
            var prev = i > 0 ? i - 1 : module.max - 1,
                next = i < module.max - 1 ? i + 1 : 0;

            module.$adcasts[prev].classList.add('prev');
            module.$adcasts[next].classList.add('next');
        },
        active : function () {
            var i = module.atual;
            module.$adcasts[i].classList.add('is-active');
            module.$pagers[i].classList.add('is-active');
            module.$adcastWrap.className = 'adcast-item-' + i;

            if (module.onChange) {
                module.onChange(i);
            }
        },
        none : function ($els) {
            $els.forEach(function ($el) {
                $el.classList.remove('is-active','prev','next');
            });
        },
        next : function () {
            var i = module.atual;

            module.none(module.$adcasts);
            module.none(module.$pagers);
            module.active();

            module.infinite(i);
        },
        _setAtual : function (i) {
            if (i < 0) {
                module.atual = module.max - 1;
            } else {
                module.atual = i < module.max ? parseInt(i, 10) : 0;
            }
        },
        _auto : function () {
            module.timer = window.setInterval(function () {
                module._setAtual(module.atual + 1);
                module.next();
            }, module.delay);
        },
        _pause: function () {
            window.clearInterval(module.timer);
            window.clearTimeout(module.tot);
        },
        _onPagersClick : function ($pager) {
            $pager.addEventListener('click', function () {
                var $this = this,
                    i = parseInt($this.getAttribute('data-adcast'), 10);

                module._pause();
                module.tot = window.setTimeout(module._auto, module.delay / 2);

                module._setAtual(i);
                module.next();
            });
        },
        _onPagersHover : function ($pager) {
            $pager.addEventListener('mouseover', function () {
                var $this = this,
                    i = parseInt($this.getAttribute('data-adcast'), 10);

                module.atual = i;
                window.clearInterval(module.timer);
                module.next();
            });
            $pager.addEventListener('mouseout', function () {
                var $this = this,
                    i = parseInt($this.getAttribute('data-adcast'), 10);

                module._setAtual(i);
                module._auto();
            });
        },
        _keyboard : function () {
            document.addEventListener('keydown', function (event){
                var i;
                if (event.keyCode === 39 || event.keyCode === 76) { //right
                    i = module.atual + 1;
                }
                if (event.keyCode === 37 || event.keyCode === 72) { //left
                    i = module.atual - 1;
                }

                module._pause();
                module.tot = window.setTimeout(module._auto, module.delay / 2);
                module._setAtual(i);
                module.next();
            });
        },
        _arrows : function () {
            if (module.$next) {
              module.$next.addEventListener('click', function(){
                  module._setAtual(module.atual + 1);
                  module.next();
              });
            }
            if (module.$prev) {
              module.$prev.addEventListener('click', function(){
                  module._setAtual(module.atual - 1);
                  module.next();
              });
            }
        },
        events : function () {
            module.$pagers.forEach(function ($pager) {
                if (module.pagersClick) {
                    module._onPagersClick($pager);
                } else {
                    module._onPagersHover($pager);
                }
            });
            module._keyboard();
            module._arrows();
        },
        init : function (config) {
            module.config(config);

            if (!module.max || module.max === 1) return;

            module.next();
            if (config.auto) module._auto();
            module.events();
        }
    };

    return {
        init : module.init
    };

}(window, document));
