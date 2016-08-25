'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var Movies = angular.module('Movies', []);
Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);

function makeRows() {
  var i = 0;
  var j = '';
  for (i = 0; i < 10; i++) {
    j += "counting...";
  }return j;
}

$("p#here").text(makeRows());