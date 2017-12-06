{
  $('button#play-pause').on('click', function() {
    player.playPause();
    $(this).attr('playState', player.playState);
  });
  $('button#next').on('click', function() {
    if (player.playState !== 'playing') { return; }
    const idx = album.songs.indexOf(player.currentlyPlaying) + 1;
    if (idx >= album.songs.length) { return; }
    player.playPause(album.songs[idx]);
  });
  $('button#previous').on('click', function() {
    if (player.playState !== 'playing') { return; }
    const idx = album.songs.indexOf(player.currentlyPlaying) - 1;
    if (idx < 0) { return; }
    player.playPause(album.songs[idx]);
  });
  $('#time-control .seek-bar').on('input', function() {
    player.skipTo(event.target.value);
  });
  setInterval(() => {
    if (player.playState !== 'playing') { return; }
    const currentTime = player.getTime();
    const duration = player.getDuration();
    const percentage = currentTime / duration * 100;
    $('#time-control .seek-bar').val(percentage);
    $('#time-control .current-time').text(Math.floor(currentTime));
    $('#time-control .total-time').text(Math.floor(duration - currentTime));
  }, 1000);
}
