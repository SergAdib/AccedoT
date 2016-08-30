// @Angular controller for movie list carousel

export function carouselController($scope) {

  $scope.expand = function(id) {
    alert("You clicked on slide: " + id + " title: " + $scope.list[id].title);
  };







}

// End of Controller
