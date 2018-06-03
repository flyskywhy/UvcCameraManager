/// <reference path="../steps.d.ts" />

// Page object for General page (shared element/operations across all pages)
'use strict';

let I;

module.exports = {
    _init() {
        I = actor();
    },

    swipeLeft(count) {
        for (let i = 0; i < count; i++) {
            I.touchPerform([{
                action: 'press',
                options: {
                    x: 400,
                }
            }, {
                action: 'moveTo',
                options: {
                    x: -300,
                }
            }, {
                action: 'release'
            }, {
                action: 'wait',
                options: {
                    ms: 100,
                }
            }]);
        }
    },

    getGeneralNavBarName() {
        console.log('getGeneralNavBarName');
    }
};
