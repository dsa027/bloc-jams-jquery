class Player_Bar_State {
  constructor() {
    this.idx = this.getCurrent();  // used for prev/next to index into the prev/next song
    this.event_type = stopped;      // is one of prev/next/play-pause/seek
    this.element = null;            // the element we're in
  }

  isPlaying() {   // is the buzz player playing?
    return player.playState === 'playing';
  }

  getCurrent() {
    return album.songs.indexOf(player.currentlyPlaying);
  }

  // get idx for prev/next song
  getEventTypeIdx() {
    const was = this.idx; // hold in case of error
    this.idx = this.getCurrent() + (this.event_type === prev ? -1 : 1);

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
        if (this.isPlaying() && this.getEventTypeIdx() != -1) {
          return true;
        }
        return false;

      case playPause:
        return true;

      case seek:
        return this.isPlaying();

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

      case playPause:
        player.playPause(album.songs[this.idx]);;
        this.element.attr('playState', player.playState);
        break;

      case seek:
        player.skipTo(event.target.value);
        break;

      case volume:
        player.setVolume(this.element.val());
        break;
    };
  }

  // if pre() successful, then post()
  prePost() {
    if (this.pre()) {
      this.post();
    }
  }

  processEvent(element, type) {
    this.element = element;
    this.event_type = type;
    this.prePost();
  }

}

const pb_state = new Player_Bar_State();
