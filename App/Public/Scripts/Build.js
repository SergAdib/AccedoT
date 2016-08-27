(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var Movies = angular.module('Movies', []);
Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);

// @ End of main module
},{"./historycontroller":2,"./listcontroller":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyController = historyController;

var _idmaker = require("./idmaker");

// // History controller has 4 main methods:
// // 'initHistory()' for History initiation, it takes whatever is and newer from localStorage or DB
// // 'updateHistory()' for History refreshing, both on localStorage and DB, autoupdate before page closing
// // 'deleteHistory()' for History deleting, both on localStorage and DB
// // 'addWatched(id,title)' to insert (or refresh watching date if watched already) watched movie into History,
// // takes 2 movie properties: id && title
function historyController($scope, $http, $window) {
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

  // @TODO autoexec on unload
  $window.onbeforeunload = $scope.onExit;
  $scope.onExit = function () {
    $scope.updateHistory();
    console.log("History updated on leaving");
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
    index = $scope.history.watchedMovies.findIndex(function (x) {
      return x.id == id && x.title == title;
    });
    if (index != -1) {
      $scope.history.watchedMovies.splice(index, 1);
      console.log("Movie entry refreshed");
    }
    $scope.history.watchedMovies.push(watched);
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
},{"./idmaker":3}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listController = listController;
// @Angular controller for movie list representation

function listController($scope, $http) {
  $scope.list = [];
  $scope.count = 0;
  $scope.update = {};

  // AJAX operations with server/DB on movielist Collection
  // // Get the movie list
  $http.get('/api/mlist').success(function (data) {
    if (data.total > 0) {
      $scope.list = data.entries;
      $scope.count = data.total;
    }
    console.log($scope.count);
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

  // Events for movielist

}
// @End of movie list Controller
},{}]},{},[1]);

//# sourceMappingURL=Build.js.map
