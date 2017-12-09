{
  album.songs.forEach( (song, index) => {
    song.element = $(`
      <tr>
        <td>
          <button>
            <span class="song-number">${index + 1}</span>
            <span class="ion-play"></span>
            <span class="ion-pause"></span>
          </button>
        </td>
        <td>${song.title}</td>
        <td>${Math.floor(song.duration/60)}:${Math.floor(song.duration%60)}</td>
      </tr>
      `);
    song.element.on('click', event => {
      pb_state.idx = index;
      pb_state.processEvent($('button#play-pause'), playPause);
    });
    $('#song-list').append(song.element);
  });

}
