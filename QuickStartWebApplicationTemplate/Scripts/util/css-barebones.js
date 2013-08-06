/**
* RequireJS Bare-bones CSS Loader Plugin 0.0.1
*/
define(['module'], function (module) {
    'use strict';
    var modconfig = (module.config && module.config()) || {};
    var cssLoader = {
        version: '0.0.1',
        load: function (name, parentRequire, onload, config) {
            var url = config.baseUrl + modconfig.cssPath + '/' + name + "." + modconfig.extension;
            var s = document.createElement('link');
            s.type = 'text/css';
            s.rel = 'stylesheet';
            s.href = url;
            document.getElementsByTagName('head')[0].appendChild(s);
            onload(null);
        }
    };
    return cssLoader;
});