// @Angular controller for movie list carousel

export function carouselController($scope) {

  $scope.expand = function(id) {
    id = id - 0;
    let obj = $scope.list[id];
    console.log(obj); // REMOVE ME :)
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

    $("#mmVideo").bind({
      pause : function() {
        var time = this.currentTime;
        $scope.$emit('movieRefreshed', [obj.id, obj.title, time]);
        console.log('emit after pause');
      },
      ended : function() {
        $scope.$emit('movieRefreshed', [obj.id, obj.title, 0]);
        $("#MovieModal").modal('hide');
        console.log('emit after ended');
      }
    });

  };

  /* @TODO
  2. update modal window depending on video width
  3. make a history popup with video lunch
  4. decorate frontend
  */

  function formRating(arr) {
    let st = '';
    for (var obj of arr) st += (' ' + obj.scheme + ' / ' + obj.rating + ',');
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

  function formCrew(arr) {
    let st = '';
    for (var obj of arr) {
      if (obj.role != obj.name) st += (' ' + obj.role + ' ' + obj.name + ',');
    }
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

  function formStars(arr) {
    let st = '';
    for (var obj of arr) {
      if (obj.role == obj.name) st += (' ' + obj.name + ',');
    }
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

  function formGenre(arr) {
    let st = '';
    for (var obj of arr) st += (' ' + obj.title + ',');
    st = (st.substring(0, (st.length - 1)) + ';');
    return st;
  };

  function formPics(arr) {
    let tags = '';
    for (var obj of arr) tags += '<img src="' + obj.url
      + '" class="img-responsive" alt="' + obj.type
      + '" title="' + obj.type + '">';
    return tags;
  };

  function formVideo(arr) {
    let tags = '';
    for (var obj of arr) tags += '<source src="' + obj.url + '" type="video/' + obj.format + '">';
    tags += '<p>Please use a modern browser to view this video.</p>';
    return tags;
  };

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
    console.log('stored time: '+time);
    video.width  = width;
    video.height = height;
    video.poster = slide;
    video.currentTime = time;
  };

}

// End of Controller
