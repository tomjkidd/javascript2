'use strict'
define(['viewmodels/controls/multiSelect'], function (MultiSelect) {
    var multiSelect = new MultiSelect(null, { options: ko.observableArray(['a', 'b', 'c']), selectedOptions: ko.observableArray([]) });

    var vm = function (element, settings) {
        var self = this;
        self.multiSelect = multiSelect;
    }

    return vm;
});