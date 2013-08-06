'use strict';
require.config({
    baseUrl: '../Scripts',
    paths: {
        'jquery': 'lib/jquery',
        'knockout': 'lib/knockout',
        'domReady': 'lib/domReady',
        'underscore': 'lib/underscore',
        'app': 'app',
        'tld': 'util/tld-barebones',
        'css': 'util/css-barebones'
    },
    shim: {
        'underscore': {
            exports: '_'
        }
    },
    config: {
        'tld': {
            templatePath: 'templates',
            extension: 'html'
        },
        'css': {
            cssPath: 'css',
            extension: 'css'
        }
    }
});
require(['jquery', 'knockout', 'underscore', 'util/utilities', 'app/FormattedTextBox',
    'tld!FormattedTextBoxTemplate',
    'css!Grid',
    'domReady!'
    ], function ($, ko, _, util, textBox, grid) {
    });