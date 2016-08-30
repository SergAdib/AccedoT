"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carouselController = carouselController;
// @Angular controller for movie list carousel

function carouselController($scope) {

  $scope.expand = function (id) {
    alert("You clicked on slide: " + id + " title: " + $scope.list[id].title);
  };
}

// End of Controller