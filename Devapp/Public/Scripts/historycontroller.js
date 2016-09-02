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

  $scope.initHistory = function() {
    $scope.getStoredHistory();
    if ($scope.storedHistory.session_id) {
      $scope.getHistory()
    } else {
      $scope.saveStoredHistory();
    }
    console.log("History successfully initiated");
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
          console.log('History updated in DB: ' + data);
        })
        .error(function(data) {
          console.log('Error updating DB history: ' + data);
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
        console.log('History deleted in DB: ' + data);
      })
      .error(function(data) {
        console.log('Error deleting DB history: ' + data);
      });
  };

  // Events for history

  $rootScope.$on('movieRefreshed', function(event, args) {
    console.log('Emited from modal', args);
    $scope.addWatched(args[0], args[1], args[2]);
  });

  $scope.addWatched = function(id, title, time) {
    let index = -1;
    let watched = {};
    watched.id = id;
    watched.title = title;
    watched.stopTime = time;
    watched.watchDate = new Date();
    if (!$scope.history.watchedMovies) {
      console.log("No history found, probably was cleared by user");
      $scope.initHistory();
    }
    index = $scope.history.watchedMovies.findIndex(x => ((x.id == id) && (x.title == title)));
    if (index != -1) {
      $scope.history.watchedMovies.splice(index, 1);
      console.log("Movie entry refreshed");
    }
    $scope.history.watchedMovies.push(watched);
    $scope.saveStoredHistory();
    console.log("Movie array +1");
  };

  $scope.formHistory = function() {
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
      $scope.history.creationDate = new Date;
      $scope.history.updatedDate = new Date;
      $scope.history.session_id = myID.make();
      console.log("History succesfully created");
    }
  console.log("Obj created: ");
  console.log($scope.history);
  };

  $scope.saveStoredHistory = function() {
    if (!$scope.history.session_id) {
      $scope.formHistory();
    };
    Lockr.set('storedHistory', $scope.history);
    console.log("History succesfully stored");
  };

  $scope.getStoredHistory = function() {
    $scope.storedHistory = Lockr.get('storedHistory');
    if (!$scope.storedHistory) {
      $scope.storedHistory = {};
      console.log("No stored history found");
    } else
    console.log("History retrieved");
  };

  $scope.deleteStoredHistory = function() {
    Lockr.rm('storedHistory');
    $scope.history = {};
    $scope.storedHistory = {};
    console.log("History deleted");
  };

}
// @End of history Controller
