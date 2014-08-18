/**
 * @file slideshow.js
 * @author William Bruno
 * @date 2013-05-25
 */
var adcast = (function(w) {
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

            module.atual = i < module.max - 1 ? parseInt(i, 10) + 1 : 0;
        },
        auto : function() {
            module.timer = w.setInterval(function() {
                module.next();
            }, module.delay);
        },
        _onPagersClick : function($pager) {
            $pager.addEventListener('click', function() {
                var $this = this,
                    i = $this.getAttribute('data-adcast');

                w.clearInterval(module.timer);
                w.clearTimeout(module.tot);
                module.tot = w.setTimeout(module.auto, module.delay / 2);

                module.atual = i < module.max ? parseInt(i, 10) : 0;
                module.next();
            });
        },
        _onPagersHover : function($pager) {
            $pager.addEventListener('mouseover', function() {
                var $this = this,
                    i = $this.getAttribute('data-adcast');

                module.atual = i;
                w.clearInterval(module.timer);
                module.none();
                module.active();
            });
            $pager.addEventListener('mouseout', function() {
                var $this = this,
                    i = $this.getAttribute('data-adcast');

                module.atual = i < module.max - 1 ? parseInt(i, 10) + 1 : 0;
                module.auto();
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

}(window));
