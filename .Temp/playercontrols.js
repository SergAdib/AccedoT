'use strict';

// @Custom player controls for video player

function playerControls() {
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
      setTimeout(function () {
        cTime.innerHTML = parseTime(video.currentTime);
      }, 1000); // or move to timeupdate listener below
    } else {
      video.pause();
      play.innerHTML = '<span class="glyphicon glyphicon-play" aria-hidden="false"></span>';
    }
  });

  // Current/Total time counters initials
  cTime.innerHTML = parseTime(video.currentTime);
  tTime.innerHTML = parseTime(video.duration);

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
    progress.value = value;
  });

  // Volume bar low / high
  volume.addEventListener("change", function () {
    video.volume = volume.value;
  });

  // Helper for time tracking
  function parseTime(time) {
    var st = '';
    var h = 0,
        m = 0,
        s = 0;
    if (time > 3600) {
      h = Math.floor(time / 3600);
      time -= 3600 * h;
      st += h + ':';
    }
    if (time > 60) {
      m = Math.floor(time / 60);
      time -= 60 * m;
      st += m + ':';
    } else {
      st += '0:';
    }
    s = Math.floor(time);
    st += s;
    return st;
  }
}

// EOF