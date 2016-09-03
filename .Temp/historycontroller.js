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
// // 'addWatched(id,title,time)' to insert (or refresh watching date if watched already) watched movie into History,
// // takes 2 movie properties: id && title and current time

// // Comm.: Adding every movie instance into a History triggers history storing/refreshing in localStorage,
// // DB update performs only upon leaving page / app closing. In case when error or unexpected problem prevented
// // history saving to DB, on next run app matchs histories stored locally and remotely and choose newest.
function historyController($scope, $http, $rootScope) {
  $scope.history = {};
  $scope.gotHistory = {};
  $scope.storedHistory = {};
  $scope.dropHistory = [];
  $scope.lastVisit = new Date();

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
      $scope.refreshDropping();
      console.log('History deleted in DB: ' + data);
    }).error(function (data) {
      console.log('Error deleting DB history: ' + data);
    });
  };

  // Events for history

  $rootScope.$on('movieRefreshed', function (event, args) {
    console.log('Emited from modal', args);
    $scope.addWatched(args[0], args[1], args[2]);
  });

  $scope.addWatched = function (id, title, time) {
    var index = -1;
    var watched = {};
    watched.id = id;
    watched.title = title;
    watched.stopTime = time;
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
    $scope.refreshDropping();
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
    $scope.refreshDropping();
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

  $scope.refreshDropping = function () {
    $scope.dropHistory = $scope.history.watchedMovies;
    console.log('Watched: ', $scope.dropHistory);
  };

  $scope.formDropHistory = function () {
    var container = $("#dropHistoryContent");
    var tags = '';
    if ($scope.dropHistory && $scope.dropHistory.length > 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $scope.dropHistory[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var status = 'and stopped at ';
          var again = 'Continue watching';
          tags += '<li><div role="separator" class="divider"></div>';
          tags += '<div><span class="droptitle">' + item.title;
          tags += '</span><span class="droptime">was saved: ' + formDate(item.watchDate);
          if (item.stopTime < 1) {
            status = "watched in full";
            again = "Watch again";
          } else {
            status += formTime(item.stopTime);
          }
          var index = $scope.list.findIndex(function (x) {
            return x.id == item.id && x.title == item.title;
          });
          tags += '</span><span class="dropstatus">' + status + '</span><span class="btn btn-link" onclick="popupme(';
          tags += index + ');">' + again + '</span></div></li>';
          $scope.lastVisit = formDate($scope.history.updatedDate);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ;
    } else {
      tags += '<li><div role="separator" class="divider"></div>No history found</li>';
      $scope.lastVisit = "Never";
    }
    container.empty().append(tags);
  };

  function formDate(date) {
    var d = new Date(date);
    var st = '';
    st += d.getHours() + ':';
    st += d.getMinutes() + ':';
    st += d.getSeconds() + ' - ';
    st += d.getDate() + '/';
    st += d.getMonth() + '/';
    st += d.getFullYear();
    return st;
  };

  function formTime(time) {
    var st = '';
    var h = 0,
        m = 0,
        s = 0;
    if (time > 3600) {
      h = Math.floor(time / 3600);
      time -= 3600 * h;
      st += h + 'h ';
    }
    if (time > 60) {
      m = Math.floor(time / 60);
      time -= 60 * m;
      st += m + 'm ';
    }
    s = Math.floor(time);
    st += s + 's ';
    return st;
  }
}
// @End of history Controller
// @Angular controller for watched movie list / history representation