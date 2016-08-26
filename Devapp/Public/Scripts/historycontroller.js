// @Angular controller for watched movie list / history representation
import {myID} from './idmaker'

export function historyController($scope, $http) {
  $scope.history = {};
  $scope.gotHistory = {};
  $scope.storedHistory = {};
  $scope.watched = {};
  $scope.watchedList = [];

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function(id) {
    $http.get('/api/history/' + id)
      .success(function(data) {
        if (data) {
          $scope.gotHistory = data;
        }
        console.log('History ready');
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
          console.log('History updated: ' + data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }
  };

  // // Delete history from Collection in DB
  $scope.deleteHistory = function(id) {
    $http.delete('/api/history/' + id)
      .success(function(data) {
        $scope.history = {};
        $scope.deleteStoredHistory();
        console.log('History deleted: ' + data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Events for history
  $scope.formWatched = function(id, title) {
    let index = -1;
    $scope.watched.id = id;
    $scope.watched.title = title;
    $scope.watched.watchDate = new Date();
    index = watchedList.findIndex(x => (x.id == id && x.title == title));
    if (index != -1) watchedList.splice(index, 1);
    $scope.watchedList.push($scope.watched);
  };

  $scope.formHistory = function() {
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
      $scope.history.creationDate = new Date;
      $scope.history.updatedDate = new Date;
      $scope.history.session_id = myID.make();
    }
  };

  $scope.saveStoredHistory = function() {
    if (!history.session_id) return;
    Lockr.set('storedHistory', $scope.history);
  };

  $scope.getStoredHistory = function() {
    $scope.storedHistory = Lockr.get('storedHistory');
  };

  $scope.deleteStoredHistory = function() {
    Lockr.rm('storedHistory');
  };

}
// @End of history Controller
