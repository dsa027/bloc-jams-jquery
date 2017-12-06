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
}
