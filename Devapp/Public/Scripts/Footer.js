// @Some tuning up after all scripts

// // Autoexec History update initiation before page closing/leaving, both to localStorage and DB
window.addEventListener('beforeunload', function(e) {
  console.log('Leaving the page');
  var scope = angular.element(document.getElementById("historywrapper")).scope();
  scope.$apply(function() {
    scope.updateHistory();
  })
});

// // Return an element index in scope and expand detailed popup/modal
function expand (index) {
  let id = index.getAttribute("href").toString();
      id = id.slice(1);
  var scope = angular.element(document.getElementById("MovieCarousel")).scope();
  scope.$apply(function() {
    scope.expand(id);
  });
  return false;
};

// // Expand detailed popup/modal from history dropdowns
function popupme (index) {
  var scope = angular.element(document.getElementById("MovieCarousel")).scope();
  scope.$apply(function() {
    scope.expand(index);
  });
  return false;
};

// // Carousel pause / cycle upon modal events
$('#MovieModal').on('shown.bs.modal', function () {
    $('#MovieCarousel').carousel('pause');
});
$('#MovieModal').on('hidden.bs.modal', function () {
    $('#MovieCarousel').carousel('cycle');
    $("#mmVideo").unbind('pause');
    $("#mmVideo").unbind('ended');
    $("#mmVideo").first().attr('src','');
});

// EOF
