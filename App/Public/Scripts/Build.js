(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var Movies = angular.module('Movies', []);
Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);

function makeRows() {
  var i = 0;
  var j = '';
  for (i = 0; i < 10; i++) {
    j += "counting...";
  }return j;
}

$("p#here").text(makeRows());
},{"./historycontroller":2,"./listcontroller":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyController = historyController;
// @Angular controller for watched movie list / history representation

function historyController($scope, $http) {
  $scope.history = {};
  $scope.watched = {};

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function (id) {
    $http.get('/api/history/' + id).success(function (data) {
      if (data) {
        $scope.history = data;
      }
      console.log('History ready');
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // // Post data to update / create history record
  // // // Simple update variant - bulk update
  $scope.updateHistory = function () {
    if ($scope.watched) {
      $scope.history.watchedMovies.push($scope.watched);
      $http.post('/api/history', $scope.history).success(function (data) {
        $scope.watched = {};
        console.log('History updated: ' + data);
      }).error(function (data) {
        console.log('Error: ' + data);
      });
    }
  };

  // // Delete history from Collection in DB
  $scope.deleteHistory = function (id) {
    $http.delete('/api/history/' + id).success(function (data) {
      console.log('History deleted: ' + data);
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // Events for history

}
// @End of history Controller
},{}],3:[function(require,module,exports){
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
