"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carouselController = carouselController;
// @Angular controller for movie list carousel

function carouselController($scope) {

  $scope.expand = function (id) {
    id = id - 0;
    var obj = $scope.list[id];
    console.log(obj); // REMOVE ME :)
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
    adjustVideo(obj.contents[0].width, obj.contents[0].height, obj.images[0].url);

    $('#MovieModal').modal();

    $("#mmVideo").bind({
      pause: function pause() {
        $scope.$emit('movieRefreshed', [obj.id, obj.title, this.currentTime]);
        console.log('emit after');
      },
      ended: function ended() {
        $scope.$emit('movieRefreshed', [obj.id, obj.title, 0]);
        $("#MovieModal").modal('hide');
        console.log('emit after');
      }
    });
  };

  /* @TODO
  save movie in history
   */

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

  function formPics(arr) {
    var tags = '';
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = arr[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var obj = _step5.value;
        tags += '<img src="' + obj.url + '" class="img-responsive" alt="' + obj.type + '" title="' + obj.type + '">';
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

  function adjustVideo(x, y, poster) {
    var width = x || 320,
        height = y || 180,
        slide = poster || "ajax-loader.gif";
    var video = document.getElementById("mmVideo");
    video.width = width;
    video.height = height;
    video.poster = slide;
  };
}

// End of Controller