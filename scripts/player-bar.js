class Player_Bar_State {
  constructor() {
    this.idx = this.get_current();  // used for prev/next to index into the prev/next song
    this.event_type = stopped;      // is one of prev/next/play-pause/seek
    this.element = null;            // the element we're in
    // change time display every second
    setInterval(() => { this.set_interval(); }, 1000);
  }

  is_playing() {   // is the buzz player playing?
    return player.playState === 'playing';
  }

  get_current() {
    return album.songs.indexOf(player.currentlyPlaying);
  }

  // get idx for prev/next song
  get_event_type_idx() {
    const was = this.idx; // hold in case of error
    this.idx = this.get_current() + (this.event_type === prev ? -1 : 1);

    // ok
    if (this.idx >= 0 && this.idx < album.songs.length) {
      return this.idx;  // new idx
    }
    // not ok
    this.idx = was; // restore idx
    return -1;
  }

  // what to do prior to entering state
  pre() {
    switch (this.event_type) {
      case prev:
      case next:
        if (this.is_playing() && this.get_event_type_idx() != -1) {
          return true;
        }
        return false;

      case play_pause:
        return true;

      case seek:
        return this.is_playing();

      default:
        return false;
    };
  }

  // what to do after entering state
  post() {
    switch (this.event_type) {
      case prev:
      case next:
        player.play_pause(album.songs[this.idx]);;
        break;

      case play_pause:
        player.play_pause(album.songs[this.idx]);;
        this.element.attr('playState', player.playState);
        break;

      case seek:
        player.skip_to(event.target.value);
        break;
    };
  }

  // if pre() successful, then post()
  pre_post() {
    if (this.pre()) {
      this.post();
    }
  }

  process_event(element, type) {
    this.element = element;
    this.event_type = type;
    this.pre_post();
  }

  set_interval() {
    if (!pb_state.is_playing()) { return; }

    const currentTime = player.get_time();
    const duration = player.get_duration();
    const percentage = currentTime / duration * 100;
    $('#time-control .seek-bar').val(percentage);
    $('#time-control .current-time').text(this.format_time(currentTime));
    $('#time-control .total-time').text(this.format_time(duration - currentTime));
  }

  format_time(seconds) {
    seconds = Math.floor(seconds);  // make sure it's not a fraction
    var date = new Date(null);      // empty date
    date.setSeconds(seconds);       // date from seconds
    date = date.toISOString();      // full ISO date
    const time = date.substr(14, 5);// show only minutes:seconds

    return time;
  }

}

const pb_state = new Player_Bar_State();

$('button#play-pause').on('click', function() {
  pb_state.process_event($(this), play_pause);
});

$('button#next').on('click', function() {
  pb_state.process_event($(this), next);
});

$('button#previous').on('click', function() {
  pb_state.process_event($(this), prev);
});

$('#time-control .seek-bar').on('input', function() {
  pb_state.process_event($(this), seek);
});
