import {listController} from './listcontroller'
import {historyController} from './historycontroller'
import {carouselController} from './carouselcontroller'

var Movies = angular.module('Movies', []);

Movies.controller('listController', listController);
Movies.controller('historyController', historyController);
Movies.controller('carouselController', carouselController);



// Autoexec History update initiation before page closing/leaving, both to localStorage and DB
window.addEventListener('beforeunload', function(e) {
  console.log('Leaving the page');
  var scope = angular.element(document.getElementById("historywrapper")).scope();
  scope.$apply(function() {
    scope.updateHistory();
  })
});





// @ End of main module
