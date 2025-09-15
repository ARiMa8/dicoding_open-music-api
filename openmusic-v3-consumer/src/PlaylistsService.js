const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT p.id, p.name FROM playlists p WHERE p.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    const playlist = result.rows[0];

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer 
             FROM songs s
             JOIN playlist_songs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songsQuery);
    playlist.songs = songsResult.rows;

    return { playlist };
  }
}

module.exports = PlaylistsService;
