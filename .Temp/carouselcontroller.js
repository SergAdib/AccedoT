"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carouselController = carouselController;
// @Angular controller for movie list carousel

function carouselController($scope) {

  // Open movie instance in modal window with player
  $scope.expand = function (id) {
    id = id - 0;
    var obj = $scope.list[id];
    $("#MovieModalLabel").text(obj.title);
    $("#mmDescription").text(obj.description);
    $("#mmDate").text(new Date(obj.publishedDate).toDateString());
    $("#mmDuration").text(obj.contents[0].duration / 1000 / 60 + " min.");
    $("#mmRating").text(formRating(obj.parentalRatings));
    $("#mmCrew").text(formCrew(obj.credits));
    $("#mmActors").text(formStars(obj.credits));
    $("#mmGenre").text(formGenre(obj.categories));
    $("#mmImage").empty().append(formPics(obj.images));
    $("#mmVideo").empty().append(formVideo(obj.contents));
    adjustVideo(obj.id, obj.title, obj.contents[0].width, obj.contents[0].height, obj.images[0].url);

    $('#MovieModal').modal();
    setModalWidth(obj.contents[0].width);

    $(window).resize(function () {
      var cwidth = parseInt(document.getElementById("MovieModalContent").style.width);
      var client = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (cwidth > client) {
        setModalWidth(client);
        console.log('Player size adjusted');
      }
    });

    $("#mmVideo").bind({
      pause: function pause() {
        var time = this.currentTime;
        $scope.$emit('movieRefreshed', [obj.id, obj.title, time]);
        //console.log('Player paused, stop time stored in history');
      },
      ended: function ended() {
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
    var video = document.getElementById("mmVideo");
    var scape = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (scape - 60 < x) {
      var w = x; // original width
      var h = video.height;
      var z = 0; // new height in % from new width
      x = scape - 120;
      z = Math.round(x * h / w);
      video.width = x;
      video.height = z;
    }
    //let percent   = Math.round(((x + 60) / scape) * 100);
    //let width     = percent.toString() + "%";
    var pixels = Math.round(x + 60);
    var width = pixels.toString() + "px";
    container.style.width = width;
  }

  // // Helper functions for movie detailed view, ratings
  function formRating(arr) {
    var st = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var obj = _step.value;
        st += ' ' + obj.scheme + ' / ' + obj.rating + ',';
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    st = st.substring(0, st.length - 1) + ';';
    return st;
  };

  // // Helper functions for movie detailed view, crew other than actors
  function formCrew(arr) {
    var st = '';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var obj = _step2.value;

        if (obj.role != obj.name) st += ' ' + obj.role + ' ' + obj.name + ',';
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    st = st.substring(0, st.length - 1) + ';';
    return st;
  };

  // // Helper functions for movie detailed view, actors
  function formStars(arr) {
    var st = '';
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = arr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var obj = _step3.value;

        if (obj.role == obj.name) st += ' ' + obj.name + ',';
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    st = st.substring(0, st.length - 1) + ';';
    return st;
  };

  // // Helper functions for movie detailed view, categories
  function formGenre(arr) {
    var st = '';
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = arr[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var obj = _step4.value;
        st += ' ' + obj.title + ',';
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    st = st.substring(0, st.length - 1) + ';';
    return st;
  };

  // // Helper functions for movie detailed view, related images
  function formPics(arr) {
    var tags = '';
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = arr[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var obj = _step5.value;
        tags += '<img src="' + obj.url + '" class="img-responsive img-thumbnail" alt="' + obj.type + '" title="' + obj.type + '">';
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return tags;
  };

  // // Form video tag with sources, could be more than one
  function formVideo(arr) {
    var tags = '';
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = arr[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var obj = _step6.value;
        tags += '<source src="' + obj.url + '" type="video/' + obj.format + '">';
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    tags += '<p>Please use a modern browser to view this video.</p>';
    return tags;
  };

  // // Adjust player settings and restore stop time if previously watched
  function adjustVideo(id, title, x, y, poster) {
    var width = x || 320,
        height = y || 180,
        item = id,
        name = title,
        slide = poster || "ajax-loader.gif",
        instance = {},
        time = 0;
    var video = document.getElementById("mmVideo");
    var history = Lockr.get('storedHistory');
    if (history) {
      instance = history.watchedMovies.find(function (x) {
        return x.id == item && x.title == name;
      });
      if (instance) {
        time = instance.stopTime;
      }
    }
    video.width = width;
    video.height = height;
    video.poster = slide;
    video.currentTime = time;
  };
}

// End of Controller