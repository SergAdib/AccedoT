'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var Movies = angular.module('Movies', []);
Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);

// @ End of main module