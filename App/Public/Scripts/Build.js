(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var Movies = angular.module('Movies', []);
Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);

// @ End of main module
},{"./historycontroller":2,"./listcontroller":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyController = historyController;

var _idmaker = require('./idmaker');

function historyController($scope, $http) {
  $scope.history = {};
  $scope.gotHistory = {};
  $scope.storedHistory = {};
  $scope.watched = {};
  $scope.watchedList = [];

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function (id) {
    $http.get('/api/history/' + id).success(function (data) {
      if (data) {
        $scope.gotHistory = data;
      }
      console.log('History ready');
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
        console.log('History updated: ' + data);
      }).error(function (data) {
        console.log('Error: ' + data);
      });
    }
  };

  // // Delete history from Collection in DB
  $scope.deleteHistory = function (id) {
    $http.delete('/api/history/' + id).success(function (data) {
      $scope.history = {};
      $scope.deleteStoredHistory();
      console.log('History deleted: ' + data);
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // Events for history
  $scope.formWatched = function (id, title) {
    var index = -1;
    $scope.watched.id = id;
    $scope.watched.title = title;
    $scope.watched.watchDate = new Date();
    index = watchedList.findIndex(function (x) {
      return x.id == id && x.title == title;
    });
    if (index != -1) watchedList.splice(index, 1);
    $scope.watchedList.push($scope.watched);
  };

  $scope.formHistory = function () {
    if ($scope.storedHistory.session_id) {
      if (!$scope.gotHistory.session_id) {
        $scope.history = $scope.storedHistory;
      } else if ($scope.storedHistory.updatedDate > $scope.gotHistory.updatedDate) {
        $scope.history = $scope.storedHistory;
      } else {
        $scope.history = $scope.gotHistory;
      }
    } else {
      $scope.history.watchedMovies = $scope.watchedList;
      $scope.history.creationDate = new Date();
      $scope.history.updatedDate = new Date();
      $scope.history.session_id = _idmaker.myID.make();
    }
  };

  $scope.saveStoredHistory = function () {
    if (!history.session_id) return;
    Lockr.set('storedHistory', $scope.history);
  };

  $scope.getStoredHistory = function () {
    $scope.storedHistory = Lockr.get('storedHistory');
  };

  $scope.deleteStoredHistory = function () {
    Lockr.rm('storedHistory');
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
