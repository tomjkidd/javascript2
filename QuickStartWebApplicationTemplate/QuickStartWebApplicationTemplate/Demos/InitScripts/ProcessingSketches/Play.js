'use strict';
define([], function () {
    // Processing.js site provides some sample code to create a clock
    return function clockSketchProc(processing) {
        var counter = 0;
        // Override draw function, by default it will be called 60 times per second
        processing.draw = function () {
            // erase background
            processing.background(224);

            // draw the square
            processing.rect(10 + counter, 10, 50, 50);

            //increment the counter
            counter = counter + 1;
        };
    };
});