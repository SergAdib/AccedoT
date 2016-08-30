import {carouselBuilder} from './carouselbuilder'
// @Angular controller for movie list representation

export function listController($scope, $http) {
  $scope.list = [];
  $scope.count = 0;
  $scope.update = {};
  $scope.medium = 0;

  // AJAX operations with server/DB on movielist Collection
  // // Get the movie list
  $http.get('/api/mlist')
    .success(function(data) {
      if (data.total > 0) {
        $scope.list = data.entries;
        $scope.count = data.total;
        // Below section is to mark active/inactive class and start from the middle of the carousel list
        $scope.medium = (Math.round($scope.count / 2));
        $scope.list.forEach(x => x.active = "");
        $scope.list[$scope.medium].active = "active";
        // EOS
        carouselBuilder($scope.list, $scope.count);
        console.log("Movie list downloaded from DB, carousel initiated");
      }
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // // Post data to update / create new movie instance
  // // // Operation not supported in current API and must return error
  $scope.updateList = function() {
    $http.post('/api/mlist', $scope.update)
      .success(function(data) {
        $scope.update = {};
        console.log('Entry inserted: ' + data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // // Delete movie instance from list in DB
  // // // Operation not supported in current API and must return error
  $scope.deleteListItem = function(id, id2) {
    $http.delete('/api/mlist/' + id + '/' + id2)
      .success(function(data) {
        console.log('Entry deleted: ' + data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

}
// @End of movie list Controller
