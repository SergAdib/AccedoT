// @Angular controller for movie list carousel

export function carouselController($scope) {

// Open movie instance in modal window with player
  $scope.expand = function(id) {
    id = id - 0;
    let obj = $scope.list[id];
    $("#MovieModalLabel").text(obj.title);
    $("#mmDescription").text(obj.description);
    $("#mmDate").text((new Date(obj.publishedDate)).toDateString());
    $("#mmDuration").text((obj.contents[0].duration / 1000 / 60)+" min.");
    $("#mmRating").text(formRating(obj.parentalRatings));
    $("#mmCrew").text(formCrew(obj.credits));
    $("#mmActors").text(formStars(obj.credits));
    $("#mmGenre").text(formGenre(obj.categories));
    $("#mmImage").empty().append(formPics(obj.images));
    $("#mmVideo").empty().append(formVideo(obj.contents));
    adjustVideo(obj.id, obj.title, obj.contents[0].width, obj.contents[0].height, obj.images[0].url);

    $('#MovieModal').modal();
    setModalWidth(obj.contents[0].width);

    $("#mmVideo").bind({
      pause : function() {
        var time = this.currentTime;
        $scope.$emit('movieRefreshed', [obj.id, obj.title, time]);
        //console.log('Player paused, stop time stored in history');
      },
      ended : function() {
        $scope.$emit('movieRefreshed', [obj.id, obj.title, 0]);
        $("#MovieModal").modal('hide');
        //console.log('Player closed, movie ended, stored in history');
      }
    });
  };

// Helper functions for movie detailed popup
// // Adjust modal window width && player width if necessary
  function setModalWidth(x) {
    var container = document.getElementById("MovieModalContent");
    var video     = document.getElementById("mmVideo");
    let scape     = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if ((scape - 60)< x) {
      let w = x; // original width
      let h = video.height;
      let z = 0; // new height in % from new width
      x = scape - 120;
      z = Math.round((x * h) / w);
      video.width  = x;
      video.height = z;
    }
    let percent   = Math.round(((x + 60) / scape) * 100);
    let width     = percent.toString() + "%";
    container.style.width = width;
  }

// // Helper functions for movie detailed view, ratings
  function formRating(arr) {
    let st = '';
    for (var obj of arr) st += (' ' + obj.scheme + ' / ' + obj.rating + ',');
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

// // Helper functions for movie detailed view, crew other than actors
  function formCrew(arr) {
    let st = '';
    for (var obj of arr) {
      if (obj.role != obj.name) st += (' ' + obj.role + ' ' + obj.name + ',');
    }
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

// // Helper functions for movie detailed view, actors
  function formStars(arr) {
    let st = '';
    for (var obj of arr) {
      if (obj.role == obj.name) st += (' ' + obj.name + ',');
    }
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

// // Helper functions for movie detailed view, categories
  function formGenre(arr) {
    let st = '';
    for (var obj of arr) st += (' ' + obj.title + ',');
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

// // Helper functions for movie detailed view, related images
  function formPics(arr) {
    let tags = '';
    for (var obj of arr) tags += '<img src="' + obj.url
      + '" class="img-responsive img-thumbnail" alt="' + obj.type
      + '" title="' + obj.type + '">';
    return tags;
  };

// // Form video tag with sources, could be more than one
  function formVideo(arr) {
    let tags = '';
    for (var obj of arr) tags += '<source src="' + obj.url + '" type="video/' + obj.format + '">';
    tags += '<p>Please use a modern browser to view this video.</p>';
    return tags;
  };

// // Adjust player settings and restore stop time if previously watched
  function adjustVideo(id, title, x, y, poster) {
    let width     = x || 320,
        height    = y || 180,
        item      = id,
        name      = title,
        slide     = poster || "ajax-loader.gif",
        instance  = {},
        time      = 0;
    var video     = document.getElementById("mmVideo");
    var history   = Lockr.get('storedHistory');
    if (history) {
      instance = history.watchedMovies.find(x => ((x.id == item) && (x.title == name)));
      if (instance) {
        time = instance.stopTime;
      }
    }
    video.width  = width;
    video.height = height;
    video.poster = slide;
    video.currentTime = time;
  };

}

// End of Controller
