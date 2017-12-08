class Player {
  constructor () {
    this.currentlyPlaying = album.songs[0];
    this.playState = stopped;
    this.volume = 80;
    this.soundObject = new buzz.sound(this.currentlyPlaying.soundFileUrl);
  }

  get_duration() {
    return this.soundObject.getDuration();
  }

  get_time() {
    return this.soundObject.getTime();
  }

  new_song(song) {
    return this.currentlyPlaying !== song;
  }

  stop_song(song) {
    $('#time-control .seek-bar').val(0);  // always start at the beginning of the song
    // Stop the currently playing sound file (even if nothing is playing)
    this.soundObject.stop();
    // Clear classes on the song that's currently playing
    this.currentlyPlaying.element.removeClass(playing + " " + paused);

    // Update our currentlyPlaying and playState properties
    this.currentlyPlaying = song;
    this.playState = stopped;
    this.soundObject = new buzz.sound(this.currentlyPlaying.soundFileUrl);
  }

  play_song() {
    this.soundObject.setVolume( this.volume );
    this.soundObject.play();
    this.playState = playing;
    this.currentlyPlaying.element.removeClass(paused).addClass(playing);
  }

  pause_song() {
    this.soundObject.pause();
    this.playState = paused;
    this.currentlyPlaying.element.removeClass(playing).addClass(paused);
  }

  play_pause (song = this.currentlyPlaying) {
    if (this.new_song(song)) {
      this.stop_song(song);
    }
    if (this.playState === paused || this.playState === stopped) {
      this.play_song();
    }
    else {
      this.pause_song();
    }
  }

  skip_to (percent) {
    if (this.playState !== playing) { return }
    this.soundObject.setTime( (percent / 100) * this.soundObject.getDuration() );
  }

  set_volume (percent) {
    this.volume = percent;
    this.soundObject.setVolume(percent);
  }
}

const player = new Player();
