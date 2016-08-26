import {listController} from './listcontroller'
import {historyController} from './historycontroller'

var Movies = angular.module('Movies', []);
Movies.controller('listController', listController);
Movies.controller('historyController', historyController);







// @ End of main module
