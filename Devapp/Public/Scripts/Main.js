import {listController} from './listcontroller'
import {historyController} from './historycontroller'

var Movies = angular.module('Movies', []);
Movies.controller('listController', listController);
Movies.controller('historyController', historyController);


function makeRows() {
  let i = 0;
  let j = '';
  for (i=0; i<10; i++) j+= "counting..."
  return j;
}


$("p#here").text(makeRows());
