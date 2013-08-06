'use strict';
define(['knockout'], function (ko) {
    function FormattedTextBoxViewModel(underlyingValue, handlers) {
        var self = this;

        // formatter's job is to show user friendly view of the underlying text
        self.formatter = handlers.formatter || function (text) { return text; };
        // validator's job is to detect errors and warnings based on user input
        self.validator = handlers.validator || function (userInput) { return { errors: [], warnings: []} };

        // validator will check for errors and warnings that the user is interested in
        // Errors and Warnings can be used to provide users with what they did wrong through bindings
        self.Errors = ko.observableArray([]);
        self.Warnings = ko.observableArray([]);

        self.FocusText = ko.observable(underlyingValue); // the underlying text

        self.HasFocus = ko.observable(false); //ko handles setting this when focused
        self.SetHasFocus = function () {
            self.HasFocus(true);
        };

        self.PerformValidation = function (text) {
            var validation = self.validator(self.FocusText().toString());
            self.Errors(validation.errors);
            self.Warnings(validation.warnings);
        };

        self.BlurText = ko.computed(function () {
            self.PerformValidation(self.FocusText())
            if (self.Errors().length === 0) {
                return self.formatter(self.FocusText().toString());
            } else {
                return self.FocusText();
            }
        });
    };
    return FormattedTextBoxViewModel;
});