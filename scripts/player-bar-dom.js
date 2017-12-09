{
  setInterval(() => {
    if (!pb_state.isPlaying()) { return; }

    const currentTime = player.getTime();
    const duration = player.getDuration();
    const percentage = currentTime / duration * 100;
    $('#time-control .seek-bar').val(percentage);
    $('#time-control .current-time').text(this.formatTime(currentTime));
    $('#time-control .total-time').text("-" + this.formatTime(duration - currentTime));
  },
    1000);

  function formatTime(seconds) {
    seconds = Math.floor(seconds);  // make sure it's not a fraction
    var date = new Date(null);      // empty date
    date.setSeconds(seconds);       // date from seconds
    date = date.toISOString();      // full ISO date
    const time = date.substr(14, 5);// show only minutes:seconds

    return time;
  }

  function resetTimeControlSeekBar() {
    $('#time-control .seek-bar').val(0);
  }

  $('button#play-pause').on('click', function() {
    pb_state.processEvent($(this), playPause);
  });

  $('button#next').on('click', function() {
    pb_state.processEvent($(this), next);
  });

  $('button#previous').on('click', function() {
    pb_state.processEvent($(this), prev);
  });

  $('#time-control .seek-bar').on('input', function() {
    pb_state.processEvent($(this), seek);
  });

  $('#volume-control .seek-bar').on('input', function() {
    pb_state.processEvent($(this), volume);
  });
}
