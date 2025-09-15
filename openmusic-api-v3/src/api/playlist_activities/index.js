const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { playlistActivitiesService, playlistsService }) => {
    const activitiesHandler = new PlaylistActivitiesHandler(
      playlistActivitiesService,
      playlistsService,
    );
    server.route(routes(activitiesHandler));
  },
};
