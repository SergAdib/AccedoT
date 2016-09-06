// @Angular controller for watched movie list / history representation
import {myID} from './idmaker'

// // History controller has 4 main methods:
// // 'initHistory()' for History initiation, it takes whatever is and newer from localStorage or DB
// // 'updateHistory()' for History refreshing, both on localStorage and DB, autoupdate before page closing
// // 'deleteHistory()' for History deleting, both on localStorage and DB
// // 'addWatched(id,title,time)' to insert (or refresh watching date if watched already) watched movie into History,
// // takes 2 movie properties: id && title and current time

// // Comm.: Adding every movie instance into a History triggers history storing/refreshing in localStorage,
// // DB update performs only upon leaving page / app closing. In case when error or unexpected problem prevented
// // history saving to DB, on next run app matchs histories stored locally and remotely and choose newest.
export function historyController($scope, $http, $rootScope) {
  $scope.history = {};
  $scope.gotHistory = {};
  $scope.storedHistory = {};
  $scope.dropHistory = [];
  $scope.lastVisit = new Date();

  $scope.initHistory = function() {
    $scope.getStoredHistory();
    if ($scope.storedHistory.session_id) {
      $scope.getHistory();
    } else {
      $scope.saveStoredHistory();
    }
  };

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function() {
    let id = $scope.storedHistory.session_id;
    $http.get('/api/history/' + id)
      .success(function(data) {
        if (data) {
          $scope.gotHistory = data[0];
        }
        $scope.formHistory();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // // Post data to update / create history record
  // // // Simple update variant - bulk update
  $scope.updateHistory = function() {
    if ($scope.history.session_id) {
      $scope.history.updatedDate = new Date();
      $scope.saveStoredHistory();
      $http.post('/api/history', $scope.history)
        .success(function(data) {
          console.log('History updated in DB');
        })
        .error(function(data) {
          console.log('Error while updating DB history: ' + data);
        });
    }
  };

  // // Delete history from Collection in DB
  $scope.deleteHistory = function() {
    let id = $scope.history.session_id;
    $http.delete('/api/history/' + id)
      .success(function(data) {
        $scope.deleteStoredHistory();
        $scope.gotHistory = {};
        $scope.refreshDropping();
        console.log('History deleted in DB: ' + data);
      })
      .error(function(data) {
        console.log('Error deleting DB history: ' + data);
      });
  };

  // Events for history

  $rootScope.$on('movieRefreshed', function(event, args) {
    $scope.addWatched(args[0], args[1], args[2]);
  });

  $scope.addWatched = function(id, title, time) {
    let index = -1;
    let watched = {};
    let msg = '';
    watched.id = id;
    watched.title = title;
    watched.stopTime = time;
    watched.watchDate = new Date();
    if (!$scope.history.watchedMovies) {
      msg += "No history found, probably was cleared by user / ";
      $scope.initHistory();
    }
    index = $scope.history.watchedMovies.findIndex(x => ((x.id == id) && (x.title == title)));
    if (index != -1) {
      $scope.history.watchedMovies.splice(index, 1);
      msg += "Stored movie refreshed / ";
    }
    $scope.history.watchedMovies.push(watched);
    msg += "Movie added to array";
    $scope.saveStoredHistory();
    console.log(msg);
    $scope.refreshDropping();
  };

  $scope.formHistory = function() {
    let msg = '';
    if ($scope.storedHistory.session_id) {
      if (!$scope.gotHistory) {
        $scope.history = $scope.storedHistory;
        msg = "History succesfully restored from local storage";
      } else if ($scope.storedHistory.updatedDate > $scope.gotHistory.updatedDate) {
        $scope.history = $scope.storedHistory;
        msg = "History succesfully restored from local storage";
      } else {
        $scope.history = $scope.gotHistory;
        msg = "History succesfully restored from DB";
      }
    } else {
      $scope.history.watchedMovies = [];
      $scope.history.creationDate = new Date;
      $scope.history.updatedDate = new Date;
      $scope.history.session_id = myID.make();
      msg = "History succesfully created";
    }
  console.log(msg, "/ Session id: ", $scope.history.session_id);
  $scope.refreshDropping();
  };

  $scope.saveStoredHistory = function() {
    if (!$scope.history.session_id) {
      $scope.formHistory();
    };
    Lockr.set('storedHistory', $scope.history);
    console.log("History succesfully stored in local storage");
  };

  $scope.getStoredHistory = function() {
    let msg = '';
    $scope.storedHistory = Lockr.get('storedHistory');
    if (!$scope.storedHistory) {
      $scope.storedHistory = {};
      msg = "No stored history found";
    } else {
      msg = "History retrieved from local storage";
    }
    console.log(msg);
  };

  $scope.deleteStoredHistory = function() {
    Lockr.rm('storedHistory');
    $scope.history = {};
    $scope.storedHistory = {};
    console.log("Current history cleared");
  };

  $scope.refreshDropping = function() {
    $scope.dropHistory = $scope.history.watchedMovies;
    if (!$scope.dropHistory) $scope.dropHistory = [];
  };

  $scope.formDropHistory = function() {
    var container = $("#dropHistoryContent");
    let tags = '';
    if ($scope.dropHistory && $scope.dropHistory.length >0 ) {
      for (var item of $scope.dropHistory) {
        let status = ' and stopped at ';
        let again  = 'Continue watching';
        tags += '<li><div role="separator" class="divider"></div>';
        tags += '<div><span class="droptitle">' + item.title;
        tags += '</span><span class="droptime"> was saved: ' + formDate(item.watchDate);
        if (item.stopTime < 1) {
          status = " watched in full";
          again  = "Watch again";
        } else {
          status += formTime(item.stopTime);
        }
        var index = $scope.list.findIndex(x => (x.id == item.id && x.title == item.title));
        tags += '</span><span class="dropstatus">' + status + '</span><span class="btn btn-link" onclick="popupme(';
        tags += index + ');" tabindex="0">' + again + '</span></div></li>';
        $scope.lastVisit = formDate($scope.history.updatedDate);
      };
    } else {
      tags += '<li><div role="separator" class="divider"></div>No history found</li>';
      $scope.lastVisit = "Never";
    }
    container.empty().append(tags);
  };

// Helper function to represent Date/Time
  function formDate(date) {
    let d    = new Date(date);
    let st   = '';
    st += d.getHours() + ':';
    st += d.getMinutes() + ':';
    st += d.getSeconds() + ' - ';
    st += d.getDate() + '/';
    st += d.getMonth() + '/';
    st += d.getFullYear();
    return st;
  };

// Helper function to represent watched time in user readable form
  function formTime(time) {
    let st = '';
    let h  = 0,
        m  = 0,
        s  = 0;
    if (time > 3600) {
      h = Math.floor(time / 3600);
      time -= (3600 * h);
      st += h + 'h ';
    }
    if (time > 60)   {
      m = Math.floor(time / 60);
      time -= (60 * m);
      st += m + 'm ';
    }
    s = Math.floor(time);
    st += s + 's ';
    return st;
  }

}
// @End of history Controller
