(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _listcontroller = require('./listcontroller');

var _historycontroller = require('./historycontroller');

var _carouselcontroller = require('./carouselcontroller');

var Movies = angular.module('Movies', []);

Movies.controller('listController', _listcontroller.listController);
Movies.controller('historyController', _historycontroller.historyController);
Movies.controller('carouselController', _carouselcontroller.carouselController);

// @ End of main module
},{"./carouselcontroller":3,"./historycontroller":4,"./listcontroller":6}],2:[function(require,module,exports){
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
    tags += '<div class="item ' + obj[i].active + '"><div class="col-xs-4 col-sm-3 col-md-2">' + '<a href="#' + i + '" onclick="expand(this);"><img src="' + obj[i].images[0].url + '" class="img-responsive" alt="' + obj[i].images[0].type + '" title="' + obj[i].title + '"></a>' + '<div class="itemcaption"><h3>' + obj[i].title + '</h3></div></div></div>' + '<!-- End of ' + i + ' slide tag -->';
  }

  // Apply carousel items scheme to carousel inner element
  $('#InnerCarousel').append(tags);

  // Make sure DOM loaded && start carousel
  $(document).ready(function () {
    // Set interval
    $('#MovieCarousel').carousel({ interval: 7000 });
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
},{}],3:[function(require,module,exports){
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
    var percent = Math.round((x + 60) / scape * 100);
    var width = percent.toString() + "%";
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
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyController = historyController;

var _idmaker = require('./idmaker');

// // History controller has 4 main methods:
// // 'initHistory()' for History initiation, it takes whatever is and newer from localStorage or DB
// // 'updateHistory()' for History refreshing, both on localStorage and DB, autoupdate before page closing
// // 'deleteHistory()' for History deleting, both on localStorage and DB
// // 'addWatched(id,title,time)' to insert (or refresh watching date if watched already) watched movie into History,
// // takes 2 movie properties: id && title and current time

// // Comm.: Adding every movie instance into a History triggers history storing/refreshing in localStorage,
// // DB update performs only upon leaving page / app closing. In case when error or unexpected problem prevented
// // history saving to DB, on next run app matchs histories stored locally and remotely and choose newest.
function historyController($scope, $http, $rootScope) {
  $scope.history = {};
  $scope.gotHistory = {};
  $scope.storedHistory = {};
  $scope.dropHistory = [];
  $scope.lastVisit = new Date();

  $scope.initHistory = function () {
    $scope.getStoredHistory();
    if ($scope.storedHistory.session_id) {
      $scope.getHistory();
    } else {
      $scope.saveStoredHistory();
    }
  };

  // AJAX operations with server/DB on history Collection
  // // Get the history instance
  $scope.getHistory = function () {
    var id = $scope.storedHistory.session_id;
    $http.get('/api/history/' + id).success(function (data) {
      if (data) {
        $scope.gotHistory = data[0];
      }
      $scope.formHistory();
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // // Post data to update / create history record
  // // // Simple update variant - bulk update
  $scope.updateHistory = function () {
    if ($scope.history.session_id) {
      $scope.history.updatedDate = new Date();
      $scope.saveStoredHistory();
      $http.post('/api/history', $scope.history).success(function (data) {
        console.log('History updated in DB');
      }).error(function (data) {
        console.log('Error while updating DB history: ' + data);
      });
    }
  };

  // // Delete history from Collection in DB
  $scope.deleteHistory = function () {
    var id = $scope.history.session_id;
    $http.delete('/api/history/' + id).success(function (data) {
      $scope.deleteStoredHistory();
      $scope.gotHistory = {};
      $scope.refreshDropping();
      console.log('History deleted in DB: ' + data);
    }).error(function (data) {
      console.log('Error deleting DB history: ' + data);
    });
  };

  // Events for history

  $rootScope.$on('movieRefreshed', function (event, args) {
    $scope.addWatched(args[0], args[1], args[2]);
  });

  $scope.addWatched = function (id, title, time) {
    var index = -1;
    var watched = {};
    var msg = '';
    watched.id = id;
    watched.title = title;
    watched.stopTime = time;
    watched.watchDate = new Date();
    if (!$scope.history.watchedMovies) {
      msg += "No history found, probably was cleared by user / ";
      $scope.initHistory();
    }
    index = $scope.history.watchedMovies.findIndex(function (x) {
      return x.id == id && x.title == title;
    });
    if (index != -1) {
      $scope.history.watchedMovies.splice(index, 1);
      msg += "Stored movie refreshed / ";
    }
    $scope.history.watchedMovies.push(watched);
    msg += "Movie added to array";
    $scope.saveStoredHistory();
    console.log(msg);
    $scope.refreshDropping();
  };

  $scope.formHistory = function () {
    var msg = '';
    if ($scope.storedHistory.session_id) {
      if (!$scope.gotHistory) {
        $scope.history = $scope.storedHistory;
        msg = "History succesfully restored from local storage";
      } else if ($scope.storedHistory.updatedDate > $scope.gotHistory.updatedDate) {
        $scope.history = $scope.storedHistory;
        msg = "History succesfully restored from local storage";
      } else {
        $scope.history = $scope.gotHistory;
        msg = "History succesfully restored from DB";
      }
    } else {
      $scope.history.watchedMovies = [];
      $scope.history.creationDate = new Date();
      $scope.history.updatedDate = new Date();
      $scope.history.session_id = _idmaker.myID.make();
      msg = "History succesfully created";
    }
    console.log(msg, "/ Session id: ", $scope.history.session_id);
    $scope.refreshDropping();
  };

  $scope.saveStoredHistory = function () {
    if (!$scope.history.session_id) {
      $scope.formHistory();
    };
    Lockr.set('storedHistory', $scope.history);
    console.log("History succesfully stored in local storage");
  };

  $scope.getStoredHistory = function () {
    var msg = '';
    $scope.storedHistory = Lockr.get('storedHistory');
    if (!$scope.storedHistory) {
      $scope.storedHistory = {};
      msg = "No stored history found";
    } else {
      msg = "History retrieved from local storage";
    }
    console.log(msg);
  };

  $scope.deleteStoredHistory = function () {
    Lockr.rm('storedHistory');
    $scope.history = {};
    $scope.storedHistory = {};
    console.log("Current history cleared");
  };

  $scope.refreshDropping = function () {
    $scope.dropHistory = $scope.history.watchedMovies;
  };

  $scope.formDropHistory = function () {
    var container = $("#dropHistoryContent");
    var tags = '';
    if ($scope.dropHistory && $scope.dropHistory.length > 0) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $scope.dropHistory[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var status = ' and stopped at ';
          var again = 'Continue watching';
          tags += '<li><div role="separator" class="divider"></div>';
          tags += '<div><span class="droptitle">' + item.title;
          tags += '</span><span class="droptime"> was saved: ' + formDate(item.watchDate);
          if (item.stopTime < 1) {
            status = " watched in full";
            again = "Watch again";
          } else {
            status += formTime(item.stopTime);
          }
          var index = $scope.list.findIndex(function (x) {
            return x.id == item.id && x.title == item.title;
          });
          tags += '</span><span class="dropstatus">' + status + '</span><span class="btn btn-link" onclick="popupme(';
          tags += index + ');">' + again + '</span></div></li>';
          $scope.lastVisit = formDate($scope.history.updatedDate);
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

      ;
    } else {
      tags += '<li><div role="separator" class="divider"></div>No history found</li>';
      $scope.lastVisit = "Never";
    }
    container.empty().append(tags);
  };

  // Helper function to represent Date/Time
  function formDate(date) {
    var d = new Date(date);
    var st = '';
    st += d.getHours() + ':';
    st += d.getMinutes() + ':';
    st += d.getSeconds() + ' - ';
    st += d.getDate() + '/';
    st += d.getMonth() + '/';
    st += d.getFullYear();
    return st;
  };

  // Helper function to represent watched time in user readable form
  function formTime(time) {
    var st = '';
    var h = 0,
        m = 0,
        s = 0;
    if (time > 3600) {
      h = Math.floor(time / 3600);
      time -= 3600 * h;
      st += h + 'h ';
    }
    if (time > 60) {
      m = Math.floor(time / 60);
      time -= 60 * m;
      st += m + 'm ';
    }
    s = Math.floor(time);
    st += s + 's ';
    return st;
  }
}
// @End of history Controller
// @Angular controller for watched movie list / history representation
},{"./idmaker":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// @ Make a unique ID for history sessions
var myID = exports.myID = function () {
    var counter = 0;
    var id = '';
    function _makeID() {
        id = new Date().getTime().toString(36) + new Date().getMilliseconds().toString() + counter;
        counter++;
    }
    return {
        make: function make() {
            _makeID();
            return id;
        },
        reset: function reset() {
            // optional
            counter = 0;
        },
        set: function set(int) {
            // optional
            if (Number(int)) {
                counter = parseInt(int);
            } else {
                counter++;
            }
        }
    };
}();

// EOF
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listController = listController;

var _carouselbuilder = require('./carouselbuilder');

// @Angular controller for movie list representation

function listController($scope, $http) {
  $scope.list = [];
  $scope.count = 0;
  $scope.update = {};
  $scope.medium = 0;

  // AJAX operations with server/DB on movielist Collection
  // // Get the movie list
  $http.get('/api/mlist').success(function (data) {
    if (data.total > 0) {
      $scope.list = data.entries;
      $scope.count = data.total;
      // Below section is to mark active/inactive class and start from the middle of the carousel list
      $scope.medium = Math.round($scope.count / 2);
      $scope.list.forEach(function (x) {
        return x.active = "";
      });
      $scope.list[$scope.medium].active = "active";
      // EOS
      (0, _carouselbuilder.carouselBuilder)($scope.list, $scope.count);
      console.log("Movie list downloaded, carousel initiated");
    }
  }).error(function (data) {
    console.log('Error: ' + data);
  });

  // // Post data to update / create new movie instance
  // // // Operation not supported in current API and must return error
  $scope.updateList = function () {
    $http.post('/api/mlist', $scope.update).success(function (data) {
      $scope.update = {};
      console.log('Entry inserted: ' + data);
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };

  // // Delete movie instance from list in DB
  // // // Operation not supported in current API and must return error
  $scope.deleteListItem = function (id, id2) {
    $http.delete('/api/mlist/' + id + '/' + id2).success(function (data) {
      console.log('Entry deleted: ' + data);
    }).error(function (data) {
      console.log('Error: ' + data);
    });
  };
}
// @End of movie list Controller
},{"./carouselbuilder":2}]},{},[1]);

//# sourceMappingURL=Build.js.map
