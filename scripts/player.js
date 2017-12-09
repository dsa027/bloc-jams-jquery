class Player {
  constructor () {
    this.currentlyPlaying = album.songs[0];
    this.playState = stopped;
    this.volume = 80;
    this.soundObject = new buzz.sound(this.currentlyPlaying.soundFileUrl);
  }

  getDuration() {
    return this.soundObject.getDuration();
  }

  getTime() {
    return this.soundObject.getTime();
  }

  newSong(song) {
    return this.currentlyPlaying !== song;
  }

  stopSong(song) {
    // put seek bar at 0
    resetTimeControlSeekBar();
    // Stop the currently playing sound file (even if nothing is playing)
    this.soundObject.stop();
    // Clear classes on the song that's currently playing
    this.currentlyPlaying.element.removeClass(playing + " " + paused);

    // Update our currentlyPlaying and playState properties
    this.currentlyPlaying = song;
    this.playState = stopped;
    this.soundObject = new buzz.sound(this.currentlyPlaying.soundFileUrl);
  }

  playSong() {
    this.soundObject.setVolume( this.volume );
    this.soundObject.play();
    this.playState = playing;
    this.currentlyPlaying.element.removeClass(paused).addClass(playing);
  }

  pauseSong() {
    this.soundObject.pause();
    this.playState = paused;
    this.currentlyPlaying.element.removeClass(playing).addClass(paused);
  }

  playPause (song = this.currentlyPlaying) {
    if (this.newSong(song)) {
      this.stopSong(song);
    }
    if (this.playState === paused || this.playState === stopped) {
      this.playSong();
    }
    else {
      this.pauseSong();
    }
  }

  skipTo (percent) {
    if (this.playState !== playing) { return }
    this.soundObject.setTime( (percent / 100) * this.soundObject.getDuration() );
  }

  setVolume (percent) {
    this.volume = percent;
    this.soundObject.setVolume(percent);
  }
}

const player = new Player();
