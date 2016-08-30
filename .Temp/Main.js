'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var _carouselcontroller = require('./carouselcontroller');

var Movies = angular.module('Movies', []);

Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);
Movies.controller('carouselController', _carouselcontroller.carouselController);

// @ End of main module