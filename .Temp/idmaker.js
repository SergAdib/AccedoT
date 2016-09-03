'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// @ Make a unique ID for history sessions
var myID = exports.myID = function () {
    var counter = 0;
    var id = '';
    function _makeID() {
        id = new Date().getTime().toString(36) + new Date().getMilliseconds().toString() + counter;
        counter++;
    }
    return {
        make: function make() {
            _makeID();
            return id;
        },
        reset: function reset() {
            // optional
            counter = 0;
        },
        set: function set(int) {
            // optional
            if (Number(int)) {
                counter = parseInt(int);
            } else {
                counter++;
            }
        }
    };
}();

// EOF