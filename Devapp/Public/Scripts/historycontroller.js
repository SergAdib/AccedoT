// @Angular controller for watched movie list / history representation

export function historyController($scope, $http) {
  $scope.history = {};
  $scope.watched = {};

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function(id) {
    $http.get('/api/history/' + id)
      .success(function(data) {
        if (data) {
          $scope.history = data;
        }
        console.log('History ready');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }

  // // Post data to update / create history record
  // // // Simple update variant - bulk update
  $scope.updateHistory = function() {
    if ($scope.watched) {
      $scope.history.watchedMovies.push($scope.watched)
      $http.post('/api/history', $scope.history)
        .success(function(data) {
          $scope.watched = {};
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
        console.log('History deleted: ' + data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Events for history






}
// @End of history Controller
