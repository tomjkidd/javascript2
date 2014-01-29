'use strict'
define([], function () {
    var vm = function (element, settings) {
        function determineName(obj) {
            if (typeof obj === 'string' || typeof obj === 'number') {
                return obj;
            } else if (settings.optionsText && typeof settings.optionsText === 'string') {
                return obj[settings.optionsText];
            } else if (obj.toString()) {
                return obj.toString();
            } else {
                return 'Option name could not be determined';
            }
        };

        var self = this;
        self.options = settings.options;
        self.selectedOptions = settings.selectedOptions;

        self.displayedOptions = ko.computed(function () {
            var os = self.options();
            return $.map(os, function (opt, i) {
                return {
                    Option: opt,
                    Name: determineName(opt),
                    IsSelected: ko.computed(function(){
                        var selected = self.selectedOptions();
                        return $.inArray(opt, selected) !== -1;
                    })
                }
            });
        });

        self.ClickHandler = function (data, event) {
            var option = data.Option;
            var selected = self.selectedOptions();

            if ($.inArray(option, selected) === -1) {
                self.selectedOptions.push(option);
            } else {
                self.selectedOptions.remove(option);
            }
        };

        self.TextBoxValue = ko.computed(function () {
            var options = self.options();
            var selectedOptions = self.selectedOptions();
            if (options.length === selectedOptions.length) {
                return '(All)';
            } else if (selectOptions.length > 1) {
                return '(Multiple)';
            } else if (selectedOptions.length === 1) {
                return '(Single)';
            } else if (selectedOptions.length < 1) {
                return '(None)';
            }
        });

        // TODO: Add the ability for enable/disable select all to be passed in as an option and have defaults to fall back on 
        self.enableSelectAll = ko.observable(true);
        self.SelectAll = ko.observable(true);

        ko.computed(function () {
            if (self.SelectAll()) {
                self.selectedOptions(self.options.slice(0));
            } else {
                self.selectedOptions([]);
            }
        });
    };
    return vm
});