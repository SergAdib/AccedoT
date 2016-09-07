import {listController} from './listcontroller'
import {historyController} from './historycontroller'
import {carouselController} from './carouselcontroller'

var Movies = angular.module('Movies', []);

Movies.controller('listController', listController);
Movies.controller('historyController', historyController);
Movies.controller('carouselController', carouselController);


// @ End of main module
