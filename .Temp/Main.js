'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var _carouselcontroller = require('./carouselcontroller');

var Movies = angular.module('Movies', []);

Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);
Movies.controller('carouselController', _carouselcontroller.carouselController);

// Autoexec History update initiation before page closing/leaving, both to localStorage and DB
window.addEventListener('beforeunload', function (e) {
  console.log('Leaving the page');
  var scope = angular.element(document.getElementById("historywrapper")).scope();
  scope.$apply(function () {
    scope.updateHistory();
  });
});

// @ End of main module