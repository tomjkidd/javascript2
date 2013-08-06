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
require(['jquery', 'knockout', 'underscore', 'util', 'app/Grid',
    'tld!FormattedTextBoxTemplate', 'tld!GridTemplate',
    'css!Grid', 'css!Debug',
    'domReady!'
    ], function ($, ko, _, util, grid) {
        var dataEntryCount = 100;
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

        //generate a bunch of random data
        var getRandomData = function () {
            var data = [];
            for (var i = 0; i < dataEntryCount; i++) {
                data.push({ name: characters[util.GetRandomInt(0, characters.length - 1)], age: util.GetRandomInt(0, 114) });
            }
            return data;
        };
        var randomData = getRandomData();

        //generate some sample data
        var sampleData = [
            { name: "Tom", age: 27 },
            { name: "Jenna", age: 29 },
            { name: "Bill", age: 40 },
            { name: "Betsy", age: 30 },
            { name: "Ned", age: 3 },
            { name: "Angie", age: 1 },
            { name: "Deiter", age: 4 },
            { name: "Benjie", age: 2 },
            { name: "Callie", age: 99 },
            { name: "Daphne", age: 98 },
            { name: "Edna", age: 97 }
        ];

        var dataSets = [randomData, sampleData];
        var serverData = ko.observableArray(dataSets[0]);

        var configuration = {
            data: serverData,
            columns: [{ headerText: "Name", rowText: "name" }, { headerText: "Age", rowText: "age"}],
            pageSize: 20
        };

        var gridViewModel = new grid(configuration);

        function Sorter() {
            var self = this;

            self.SortBy = function (type) {
                serverData.sort(function (a, b) {
                    return a[type] < b[type] ? -1 : 1;
                });
            };

        };

        function Debug() {
            var self = this;
            self.pageSize = gridViewModel.pageSize;
            self.SetServerData = function (index) {
                gridViewModel.currentPageIndex(0);
                serverData(dataSets[index]);
            };
        };

        ko.applyBindings(gridViewModel, $('#ko-grid')[0]);
        ko.applyBindings(new Sorter(), $('#ko-grid-sort')[0]);
        ko.applyBindings(new Debug(), $('#debug')[0]);

    });