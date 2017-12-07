
const prev = "prev";
const next = "next";
const play_pause = "play-pause";
const seek = "seek";

class Pb_State {
  constructor() {
    this.idx = 0;            // used for prev/next to index into the prev/next song
    this.event_type = play_pause;   // is one of prev/next/play-pause/seek
    this.element = null;    // the element we're in
  }

  is_playing() {   // is the buzz player playing?
    return player.playState === 'playing';
  }

  // get idx for prev/next song
  get_event_type_idx() {
    const was = this.idx; // hold in case of error
    this.idx = album.songs.indexOf(player.currentlyPlaying)
        + (this.event_type === prev ? -1 : 1);

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
        player.playPause(album.songs[this.idx]);;
        break;

      case play_pause:
        player.playPause(album.songs[this.idx]);;
        this.element.attr('playState', player.playState);
        break;

      case seek:
        player.skipTo(event.target.value);
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
}

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

const pb_state = new Pb_State();


// {
//   $('button#play-pause').on('click', function() {
//     player.playPause();
//     $(this).attr('playState', player.playState);
//   });
//   $('button#next').on('click', function() {
//     if (player.playState !== 'playing') { return; }
//     const idx = album.songs.indexOf(player.currentlyPlaying) + 1;
//     if (idx >= album.songs.length) { return; }
//     player.playPause(album.songs[idx]);
//   });
//   $('button#previous').on('click', function() {
//     if (player.playState !== 'playing') { return; }
//     const idx = album.songs.indexOf(player.currentlyPlaying) - 1;
//     if (idx < 0) { return; }
//     player.playPause(album.songs[idx]);
//   });
//   $('#time-control .seek-bar').on('input', function() {
//     player.skipTo(event.target.value);
//   });
//   setInterval(() => {
//     if (player.playState !== 'playing') { return; }
//     const currentTime = player.getTime();
//     const duration = player.getDuration();
//     const percentage = currentTime / duration * 100;
//     $('#time-control .seek-bar').val(percentage);
//     $('#time-control .current-time').text(Math.floor(currentTime));
//     $('#time-control .total-time').text(Math.floor(duration - currentTime));
//   }, 1000);
// }
