(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var _carouselcontroller = require('./carouselcontroller');

var Movies = angular.module('Movies', []);

Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);
Movies.controller('carouselController', _carouselcontroller.carouselController);

// @ End of main module
},{"./carouselcontroller":3,"./historycontroller":4,"./listcontroller":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carouselBuilder = carouselBuilder;
// @Helper function for movie list representation
// // This is to achieve workability of bootstrap carousel with angular loaded content

function carouselBuilder(obj, counter) {

  // Start building carousel items scheme
  var tags = '';
  for (var i = 0; i < counter; i++) {
    tags += '<div class="item ' + obj[i].active + '"><div class="col-xs-12 col-sm-4 col-md-2">' + '<a href="#' + i + '" onclick="expand(this);"><img src="' + obj[i].images[0].url + '" class="img-responsive" alt="' + obj[i].images[0].type + '" title="' + obj[i].title + '"></a></div></div>' + '<!-- End of ' + i + ' slide tag -->';
  }

  /*
  Temporary to store scheme
  
  
      <a href="#"><img src="{{item.images[0].url}}" alt="{{item.images[0].type}}" class="img-responsive"></a>
    </div>
    <div class="carousel-caption">
      <h3>{{item.title}}</h3>
      <span>And what it is: {{$index}}</span>
    </div>
  </div>
  
  */

  // Apply scheme to carousel inner element
  $('#InnerCarousel').append(tags);

  // Make sure DOM loaded && start carousel
  $(document).ready(function () {
    // Set interval
    $('#MovieCarousel').carousel({ interval: 15000 });
    // Set multiple slides scrolling
    $('#InnerCarousel .item').each(function () {
      var itemToClone = $(this);
      for (var i = 1; i < 6; i++) {
        itemToClone = itemToClone.next();
        if (!itemToClone.length) {
          itemToClone = $(this).siblings(':first');
        }
        itemToClone.children(':first-child').clone().addClass("cloneditem-" + i).appendTo($(this));
      };
    });
  });
}

// EOF
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carouselController = carouselController;
// @Angular controller for movie list carousel

function carouselController($scope) {

  $scope.expand = function (id) {
    alert("You clicked on slide: " + id + " title: " + $scope.list[id].title);
  };
}

// End of Controller
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyController = historyController;

var _idmaker = require('./idmaker');

// // History controller has 4 main methods:
// // 'initHistory()' for History initiation, it takes whatever is and newer from localStorage or DB
// // 'updateHistory()' for History refreshing, both on localStorage and DB, autoupdate before page closing
// // 'deleteHistory()' for History deleting, both on localStorage and DB
// // 'addWatched(id,title)' to insert (or refresh watching date if watched already) watched movie into History,
// // takes 2 movie properties: id && title

// // Comm.: Adding every movie instance into a History triggers history storing/refreshing in localStorage,
// // DB update performs only upon leaving page / app closing. In case when error or unexpected problem prevented
// // history saving to DB, on next run app matchs histories stored locally and remotely and choose newest.
function historyController($scope, $http) {
  $scope.history = {};
  $scope.gotHistory = {};
  $scope.storedHistory = {};

  $scope.initHistory = function () {
    $scope.getStoredHistory();
    if ($scope.storedHistory.session_id) {
      $scope.getHistory();
    } else {
      $scope.saveStoredHistory();
    }
    console.log("History successfully initiated");
  };

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function () {
    var id = $scope.storedHistory.session_id;
    $http.get('/api/history/' + id).success(function (data) {
      if (data) {
        $scope.gotHistory = data[0];
      }
      $scope.formHistory();
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // // Post data to update / create history record
  // // // Simple update variant - bulk update
  $scope.updateHistory = function () {
    if ($scope.history.session_id) {
      $scope.history.updatedDate = new Date();
      $scope.saveStoredHistory();
      $http.post('/api/history', $scope.history).success(function (data) {
        console.log('History updated in DB: ' + data);
      }).error(function (data) {
        console.log('Error updating DB history: ' + data);
      });
    }
  };

  // // Delete history from Collection in DB
  $scope.deleteHistory = function () {
    var id = $scope.history.session_id;
    $http.delete('/api/history/' + id).success(function (data) {
      $scope.deleteStoredHistory();
      $scope.gotHistory = {};
      console.log('History deleted in DB: ' + data);
    }).error(function (data) {
      console.log('Error deleting DB history: ' + data);
    });
  };

  // Events for history
  $scope.addWatched = function (id, title) {
    var index = -1;
    var watched = {};
    watched.id = id;
    watched.title = title;
    watched.watchDate = new Date();
    if (!$scope.history.watchedMovies) {
      console.log("No history found, probably was cleared by user");
      $scope.initHistory();
    }
    index = $scope.history.watchedMovies.findIndex(function (x) {
      return x.id == id && x.title == title;
    });
    if (index != -1) {
      $scope.history.watchedMovies.splice(index, 1);
      console.log("Movie entry refreshed");
    }
    $scope.history.watchedMovies.push(watched);
    $scope.saveStoredHistory();
    console.log("Movie array +1");
  };

  $scope.formHistory = function () {
    if ($scope.storedHistory.session_id) {
      if (!$scope.gotHistory) {
        $scope.history = $scope.storedHistory;
        console.log("History succesfully created from stored");
      } else if ($scope.storedHistory.updatedDate > $scope.gotHistory.updatedDate) {
        $scope.history = $scope.storedHistory;
        console.log("History succesfully created from stored");
      } else {
        $scope.history = $scope.gotHistory;
        console.log("History succesfully created from stored in DB");
      }
    } else {
      $scope.history.watchedMovies = [];
      $scope.history.creationDate = new Date();
      $scope.history.updatedDate = new Date();
      $scope.history.session_id = _idmaker.myID.make();
      console.log("History succesfully created");
    }
    console.log("Obj created: ");
    console.log($scope.history);
  };

  $scope.saveStoredHistory = function () {
    if (!$scope.history.session_id) {
      $scope.formHistory();
    };
    Lockr.set('storedHistory', $scope.history);
    console.log("History succesfully stored");
  };

  $scope.getStoredHistory = function () {
    $scope.storedHistory = Lockr.get('storedHistory');
    if (!$scope.storedHistory) {
      $scope.storedHistory = {};
      console.log("No stored history found");
    } else console.log("History retrieved");
  };

  $scope.deleteStoredHistory = function () {
    Lockr.rm('storedHistory');
    $scope.history = {};
    $scope.storedHistory = {};
    console.log("History deleted");
  };
}
// @End of history Controller
// @Angular controller for watched movie list / history representation
},{"./idmaker":5}],5:[function(require,module,exports){
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
            counter = 0;
        },
        set: function set(int) {
            if (Number(int)) {
                counter = parseInt(int);
            } else {
                counter++;
            }
        }
    };
}();

// EOF
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listController = listController;

var _carouselbuilder = require('./carouselbuilder');

// @Angular controller for movie list representation

function listController($scope, $http) {
  $scope.list = [];
  $scope.count = 0;
  $scope.update = {};
  $scope.medium = 0;

  // AJAX operations with server/DB on movielist Collection
  // // Get the movie list
  $http.get('/api/mlist').success(function (data) {
    if (data.total > 0) {
      $scope.list = data.entries;
      $scope.count = data.total;
      // Below section is to mark active/inactive class and start from the middle of the carousel list
      $scope.medium = Math.round($scope.count / 2);
      $scope.list.forEach(function (x) {
        return x.active = "";
      });
      $scope.list[$scope.medium].active = "active";
      // EOS
      (0, _carouselbuilder.carouselBuilder)($scope.list, $scope.count);
      console.log("Movie list downloaded from DB, carousel initiated");
    }
  }).error(function (data) {
    console.log('Error: ' + data);
  });

  // // Post data to update / create new movie instance
  // // // Operation not supported in current API and must return error
  $scope.updateList = function () {
    $http.post('/api/mlist', $scope.update).success(function (data) {
      $scope.update = {};
      console.log('Entry inserted: ' + data);
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // // Delete movie instance from list in DB
  // // // Operation not supported in current API and must return error
  $scope.deleteListItem = function (id, id2) {
    $http.delete('/api/mlist/' + id + '/' + id2).success(function (data) {
      console.log('Entry deleted: ' + data);
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };
}
// @End of movie list Controller
},{"./carouselbuilder":2}]},{},[1]);

//# sourceMappingURL=Build.js.map
