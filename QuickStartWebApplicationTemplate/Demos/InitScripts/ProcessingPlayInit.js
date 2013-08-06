'use strict';
require.config({
    baseUrl: '../../Scripts',
    paths: {
        'jquery': 'lib/jquery',
        'knockout': 'lib/knockout',
        'domReady': 'lib/domReady',
        'underscore': 'lib/underscore',
        'util': 'util/utilities',
        'app': 'app',
        'tld': 'util/tld-barebones',
        'css': 'util/css-barebones',
        'processing': 'lib/processing',
        'play': '../Demos/InitScripts/ProcessingSketches/Play'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'processing': {
            exports: 'Processing'
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
require(['jquery', 'knockout', 'underscore', 'util', 'processing', 'play',
    'domReady!'
    ], function ($, ko, _, util, Processing, playSketch) {
        // create an observable for the current time
        var cdt = ko.observable();

        // update the current time every second
        setInterval(function () {
            cdt(new Date());
        }, 1000);

        // Get a reference to the canvas element
        var canvas = $("#sketch-canvas")[0];

        // Create a Processing object, passing in the overridden draw method
        var processingInstance = new Processing(canvas, playSketch);

        // Create Start/Stop functionality for the sketch
        function ViewModel() {
            var self = this;
            self.CurrentDateTime = ko.computed(function () {
                return cdt() !== undefined ? cdt() : "";
            });
            self.ProcessingInstance = processingInstance;
            self.StartSketch = function () {
                self.switchSketchState(true);
            };
            self.StopSketch = function () {
                self.switchSketchState(false);
            };
            self.switchSketchState = function (on) {
                if (!self.ProcessingInstance) {
                    self.ProcessingInstance = Processing.getInstanceById('sketch-canvas');
                }

                if (on) {
                    self.ProcessingInstance.loop();  // call Processing loop() function
                } else {
                    self.ProcessingInstance.noLoop(); // stop animation, call noLoop()
                }
            };
        };

        // Expose the Start/Stop functionality for the sketch
        var viewModel = new ViewModel();
        ko.applyBindings(viewModel, $('#view-model')[0]);
    });