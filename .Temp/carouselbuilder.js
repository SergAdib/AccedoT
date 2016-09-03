'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carouselBuilder = carouselBuilder;
// @Helper function for movie list representation
// // This is to achieve workability of bootstrap carousel with angular loaded content

function carouselBuilder(obj, counter) {

  // Start building carousel items scheme
  var tags = '';
  for (var i = 0; i < counter; i++) {
    tags += '<div class="item ' + obj[i].active + '"><div class="col-xs-12 col-sm-4 col-md-2">' + '<a href="#' + i + '" onclick="expand(this);"><img src="' + obj[i].images[0].url + '" class="img-responsive" alt="' + obj[i].images[0].type + '" title="' + obj[i].title + '"></a>' + '<div class="itemcaption"><h3>' + obj[i].title + '</h3></div></div></div>' + '<!-- End of ' + i + ' slide tag -->';
  }

  // Apply carousel items scheme to carousel inner element
  $('#InnerCarousel').append(tags);

  // Make sure DOM loaded && start carousel
  $(document).ready(function () {
    // Set interval
    $('#MovieCarousel').carousel({ interval: 5000 });
    // Set multiple slides scrolling
    $('#InnerCarousel .item').each(function () {
      var itemToClone = $(this);
      for (var i = 1; i < 6; i++) {
        itemToClone = itemToClone.next();
        if (!itemToClone.length) {
          itemToClone = $(this).siblings(':first');
        }
        itemToClone.children(':first-child').clone().addClass("cloneditem-" + i).appendTo($(this));
      };
    });
  });
}

// EOF