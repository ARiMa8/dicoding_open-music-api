const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    this._playlistActivitiesService = playlistActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistActivitiesService.getActivities(
      playlistId,
    );

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
