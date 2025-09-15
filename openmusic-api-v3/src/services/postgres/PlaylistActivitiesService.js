const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivitiesService {
  constructor(pool) {
    this._pool = pool;
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `history-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Aktivitas Playlist gagal ditambahkan');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: `
        SELECT u.username, s.title, psa.action, psa.time
        FROM playlist_song_activities psa
        INNER JOIN users u ON u.id = psa.user_id
        INNER JOIN songs s ON s.id = psa.song_id
        WHERE psa.playlist_id = $1
        ORDER BY psa.time ASC
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;
