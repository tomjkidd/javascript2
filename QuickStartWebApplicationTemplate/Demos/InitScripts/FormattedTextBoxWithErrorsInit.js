'use strict';
require.config({
    baseUrl: '../../Scripts',
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
        var fmtr = util.Formatters.ThousandCommas,
            vldtr = util.Validators.Number,
            opts = { formatter: fmtr, validator: vldtr };
        var numberOfTextBoxes = 5;
        var initialValues = [];
        for (var i = 0; i < numberOfTextBoxes; i++) {
            initialValues.push(util.GetRandomInt(0, 1000));
        }

        var allErrors = ko.observable({});

        var textBoxes = ko.observableArray([]);
        $.each(initialValues, function (index, element) {
            var check = new textBox(element, opts);
            textBoxes.push(check);
        });

        // pay attention to the errors in any of the text boxes for the banner
        ko.computed(function () {
            var errors = [];
            var tb = textBoxes();
            $.each(tb, function (index, element) {
                var es = element.Errors();
                $.each(es, function (i, e) {
                    if (!_.contains(errors, e)) {
                        errors.push(e);
                    }
                });
            });
            allErrors(errors);
        });

        var textboxViewModel = {
            Boxes: textBoxes,
            Errors: allErrors
        };

        ko.applyBindings(textboxViewModel, $('#container')[0]);
    });