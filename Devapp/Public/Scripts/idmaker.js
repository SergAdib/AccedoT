// @ Make a unique ID for history sessions
export var myID = (function() {
    var counter = 0;
    var id = '';
    function _makeID() {
        id = (new Date().getTime()).toString(36)+(new Date().getMilliseconds().toString())+counter;
        counter++;
    }
    return {
        make : function(){
            _makeID();
            return id;
        },
        reset : function() {
            counter = 0;
        },
        set : function(int) {
            if (Number(int)) {
                counter = parseInt(int);
            } else {
                counter++;
            }
        }
    };
})();

// EOF
