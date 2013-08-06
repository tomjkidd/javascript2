'use strict';
define(['knockout'], function (ko) {
    function GridViewModel(configuration) {
        var self = this;
        var unwrap = ko.utils.unwrapObservable;
        self.data = configuration.data;
        self.currentPageIndex = ko.observable(0);
        self.pageSize = ko.observable(configuration.pageSize || 5);
        self.pageSize.subscribe(function (newValue) {
            // When the page size is altered, reset the index to zero
            self.currentPageIndex(0);
        });
        self.columns = configuration.columns;
        self.itemsOnCurrentPage = ko.computed(function () {
            var pageSize = parseInt(unwrap(self.pageSize), 10);
            var currentPageIndex = unwrap(self.currentPageIndex);
            var startIndex = pageSize * currentPageIndex;
            return self.data.slice(startIndex, startIndex + pageSize);
        });
        self.maxPageIndex = ko.computed(function () {
            var dataCount = unwrap(self.data).length;
            var pageSize = unwrap(self.pageSize);
            return Math.ceil(dataCount / pageSize);
        });
        self.PageNumbers = ko.computed(function () {
            var maxPageIndex = unwrap(self.maxPageIndex);
            var check = ko.utils.range(1, maxPageIndex);
            return check;
        });
    };
    return GridViewModel;
});