define([], function () {
    var vm = {
        title: 'TK Test Modal'
    }

    return vm;

    ko.bindingHandlers.modal = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var check = element;
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var check = element;
        }
    }
});