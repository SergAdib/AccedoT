'use strict';

// @Some tuning up after all scripts
//import {playerControls} from './playercontrols'

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

// // Expand detailed popup/modal from history dropdowns
function popupme(index) {
  var scope = angular.element(document.getElementById("MovieCarousel")).scope();
  scope.$apply(function () {
    scope.expand(index);
  });
  return false;
};

// // Carousel pause / cycle upon modal events
$('#MovieModal').on('show.bs.modal', function () {
  $('#MovieCarousel').carousel('pause');
});
$('#MovieModal').on('hidden.bs.modal', function () {
  $('#MovieCarousel').carousel('cycle');
  //$("#mmVideo")[0].pause(); // that works as well as trigger below
  if (!$("#mmVideo").prop('paused')) $("#mmVideo").trigger('pause');
  $("#mmVideo").unbind('pause');
  $("#mmVideo").unbind('ended');
});

// // Navigation for modals && body
$().ready(function () {
  // Helper function for focusing
  function focusit(obj) {
    return setTimeout(function () {
      obj.focus();
      console.log('Focus transferred to:', obj);
    }, 10);
  };

  // Binding focus handlers to History elements
  var histbtn = $('#dropdownHistory');
  $(".dropdown").on("show.bs.dropdown", function (event) {
    var dropdown = $(event.target).children('ul.dropdown-menu');
    var clearbtn = dropdown.children('li.btn.btn-warning');
    var links = dropdown.children('div#dropHistoryContent').children('li').find('span.btn.btn-link');
    focusit(clearbtn);
    // history clear button
    clearbtn.keydown(function (e) {
      if (e.which == 13) {
        this.click().off('click');
        focusit(histbtn);
      };
      if (e.which == 38) {
        if (links.length != 0) focusit(links[links.length - 1]);
      };
      if ((e.which == 40 || e.which == 9) && links.length != 0) {
        e.stopPropagation();
        focusit(links[0]);
      };
    });
    // movie instances events
    if (links.length > 0) {
      links.each(function (index) {
        $(this).keydown(function (e) {
          if (e.which == 13) {
            this.click();
            //.off('click');
          };
          if (e.which == 38) {
            if (index != 0) {
              focusit(links[index - 1]);
            } else {
              focusit(clearbtn);
            }
          };
          if (e.which == 40 || e.which == 9) {
            e.stopPropagation();
            if (index < links.length - 1) {
              focusit(links[index + 1]);
            } else {
              focusit(clearbtn);
            }
          };
        });
      });
    }
  });
  $(".dropdown").on("hidden.bs.dropdown", function (event) {
    focusit(histbtn);
  });

  // Binding focus handlers for movie box
  $('#MovieModal').on('shown.bs.modal', function () {
    var closebtn = $('.modal-footer>button');
    var player = $('video#mmVideo');
    focusit(player);

    closebtn.keydown(function (e) {
      e.preventDefault();
      if (e.which == 40 || e.which == 39 || e.which == 9) {
        focusit(player);
      }
      if (e.which == 37 || e.which == 38) {
        focusit(player);
      }
    });
    // // // Bind to player controls


    // // // Bind to player controls
  });
  $('#MovieModal').on('hide.bs.modal', function () {
    focusit(histbtn); // temporary
  });

  // Binding focus hadlers to slides

});

// @@Custom player controls for video player

window.onload = function () {
  var video = document.getElementById('mmVideo');
  var play = document.getElementById('mmPlay');
  var cTime = document.getElementById('mmCurrentTime');
  var tTime = document.getElementById('mmTotalTime');
  var progress = document.getElementById('mmProgress');
  var mute = document.getElementById('mmMute');
  var volume = document.getElementById('mmVolume');
  var sized = document.getElementById('mmFull');

  // Play/Pause cycle
  play.addEventListener("click", function () {
    if (video.paused) {
      video.play();
      play.innerHTML = '<span class="glyphicon glyphicon-pause" aria-hidden="false"></span>';
      //setTimeout(function(){cTime.innerHTML = parseTime(video.currentTime)},1000); // or move to timeupdate listener below
    } else {
      video.pause();
      play.innerHTML = '<span class="glyphicon glyphicon-play" aria-hidden="false"></span>';
    }
  });

  // Volume on / off checker
  mute.addEventListener("click", function () {
    if (video.muted) {
      video.muted = false;
      mute.innerHTML = '<span class="glyphicon glyphicon-volume-up" aria-hidden="false"></span>';
    } else {
      video.muted = true;
      mute.innerHTML = '<span class="glyphicon glyphicon-volume-off" aria-hidden="false"></span>';
    }
  });

  // Full screen on / off checker
  sized.addEventListener("click", function () {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  });

  // Movie progress bar tracking / adjustment
  progress.addEventListener("change", function () {
    var time = video.duration * (progress.value / 100);
    video.currentTime = time;
  });
  progress.addEventListener("mousedown", function () {
    video.pause(); // to prevent stuck on dragging
  });
  progress.addEventListener("mouseup", function () {
    video.play();
  });
  video.addEventListener("timeupdate", function () {
    var value = 100 / video.duration * video.currentTime;
    cTime.innerHTML = parseTime(video.currentTime);
    tTime.innerHTML = parseTime(video.duration);
    progress.value = value;
  });

  // Volume bar low / high
  volume.addEventListener("change", function () {
    video.volume = volume.value;
  });

  // Helper for time tracking
  function m2(time) {
    var t = time;
    if (t < 10 && t > 0) t = '0' + t;
    if (t == 0) t = '00';
    return t;
  }
  function parseTime(time) {
    time = Math.floor(time);
    var st = '';
    var h = 0,
        m = 0,
        s = 0;
    if (time > 3600) {
      h = Math.floor(time / 3600);
      h = m2(h);
      time -= 3600 * h;
      st += h + ':';
    } else {
      st += '00:';
    }
    if (time > 60) {
      m = Math.floor(time / 60);
      m = m2(m);
      time -= 60 * m;
      st += m + ':';
    } else {
      st += '00:';
    }
    s = Math.floor(time);
    s = m2(s);
    st += s;
    return st;
  }
};

// EOF