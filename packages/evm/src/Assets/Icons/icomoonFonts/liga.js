/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'spinner4': '&#xe97d;',
            'loading5': '&#xe97d;',
            'info': '&#xea0c;',
            'information': '&#xea0c;',
            'arrow-up-right2': '&#xea3b;',
            'up-right2': '&#xea3b;',
            'radio-checked': '&#xea54;',
            'radio-button': '&#xea54;',
            'camera': '&#xe90f;',
            'photo': '&#xe90f;',
            'file-text': '&#xe92e;',
            'file': '&#xe92e;',
            'file-video': '&#xe92f;',
            'file8': '&#xe92f;',
            'compass2': '&#xe94a;',
            'direction2': '&#xe94a;',
            'drawer': '&#xe95c;',
            'box': '&#xe95c;',
            'drawer2': '&#xe95d;',
            'box2': '&#xe95d;',
            'spinner4': '&#xe97e;',
            'loading5': '&#xe97e;',
            'menu': '&#xe9bd;',
            'list3': '&#xe9bd;',
            'minus': '&#xea0b;',
            'subtract': '&#xea0b;',
            'checkmark': '&#xea10;',
            'tick': '&#xea10;',
            'play3': '&#xea1c;',
            'player8': '&#xea1c;',
            'pause2': '&#xea1d;',
            'player9': '&#xea1d;',
            'backward2': '&#xea1f;',
            'player11': '&#xea1f;',
            'forward3': '&#xea20;',
            'player12': '&#xea20;',
            'volume-high': '&#xea26;',
            'volume': '&#xea26;',
            'volume-medium': '&#xea27;',
            'volume2': '&#xea27;',
            'volume-low': '&#xea28;',
            'volume3': '&#xea28;',
            'volume-mute': '&#xea29;',
            'volume4': '&#xea29;',
            'volume-mute2': '&#xea2a;',
            'volume5': '&#xea2a;',
            'checkbox-checked': '&#xea52;',
            'checkbox': '&#xea52;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/icon-/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
