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
        $scope.medium = (Math.round($scope.count / 2));
        $scope.list.forEach(x => x.active = "");
        $scope.list[$scope.medium].active = "active";
        ////////////////////
        console.log("Movie list downloaded from DB");
        let tags ='';
        for (var i=0; i < $scope.list.length; i++) {
          tags += '<div class="item ' + $scope.list[i].active
               + '"><div class="col-xs-12 col-sm-4 col-md-2">'
               + '<a href="#"><img src="' + $scope.list[i].images[0].url
               + '" class="img-responsive"></a></div></div>'
               + '<!-- End of ' + i + 'slide tag -->';
        }
        $('#InnerCarousel').append(tags);

        $(document).ready(function(){

          $('#MovieCarousel').carousel({ interval: 4000 });

          $('#InnerCarousel .item').each(function(){
            var itemToClone = $(this);

            for (var i=1;i<6;i++) {
              itemToClone = itemToClone.next();

              if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
              }

              itemToClone.children(':first-child').clone()
                .addClass("cloneditem-"+(i))
                .appendTo($(this));
            }
          });

        });


        ////////////////////
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

  // Events for movielist

}
// @End of movie list Controller
