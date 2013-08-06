'use strict';
define(['knockout'], function (ko) {
    var self = {};
    self.Validators = {
        Number: function (userInput) {
            var errors = [];
            var warnings = [];
            //Does the input have non-digit or decimal poiht input?
            if (/[^\d.]/g.test(userInput))
                errors.push('Please enter only digits');
            //Does the input have more than one period?
            if (/\..*\./g.test(userInput))
                errors.push('Please only use a single decimal point (at most)');
            //Does the input have at most four digits of precision?
            if (/\.\d\d\d\d\d/g.test(userInput))
                errors.push('Please only use at most 4 digits of precision');
            return { errors: errors, warnings: warnings };
        }
    };
    self.Formatters = {
        ThousandCommas: function (inputText) {
            var numChars = 3;
            //find the decimal point in inputText
            var s = inputText.split('.');
            var left = s[0];
            //dump everything to the right of the decimal point into a tmp string
            var right = s.length === 2 ? ('.' + s[1]) : '';
            var rtn = right;
            //while chars remaining is > 3
            while (left.length > numChars) {
                //pop three chars, prepend them to the tmp string
                var next = left.substring(left.length - numChars, left.length);
                rtn = next + rtn;
                //pop remaining chars to start loop again
                left = left.substring(0, left.length - numChars);
                if (left.length > 0)
                //prepend a comma if there will be another iteration
                    rtn = ',' + rtn;
            }
            rtn = left + rtn;
            return rtn;
        }
    };
    self.GetRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return self;
});