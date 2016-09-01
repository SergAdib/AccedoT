'use strict';

// @Some tuning up after all scripts

// // Autoexec History update initiation before page closing/leaving, both to localStorage and DB
window.addEventListener('beforeunload', function (e) {
  console.log('Leaving the page');
  var scope = angular.element(document.getElementById("historywrapper")).scope();
  scope.$apply(function () {
    scope.updateHistory();
  });
});

// // Return an element index in scope and expand detailed popup/modal

function expand(index) {
  var id = index.getAttribute("href").toString();
  id = id.slice(1);
  var scope = angular.element(document.getElementById("MovieCarousel")).scope();
  scope.$apply(function () {
    scope.expand(id);
  });
  return false;
};

// // Carousel pause / cycle

$('#MovieModal').on('shown.bs.modal', function () {
  $('#MovieCarousel').carousel('pause');
});
$('#MovieModal').on('hidden.bs.modal', function () {
  $('#MovieCarousel').carousel('cycle');
});

// EOF