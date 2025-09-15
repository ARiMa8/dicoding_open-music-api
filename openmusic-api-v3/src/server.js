require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const { Pool } = require('pg');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const playlistActivities = require('./api/playlist_activities');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');

const albumLikes = require('./api/album_likes');

const exportsPlugin = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const CacheService = require('./services/cache/CacheService');
const StorageService = require('./services/storage/StorageService');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  console.log('ACCESS_TOKEN_AGE from env:', process.env.ACCESS_TOKEN_AGE);
  console.log('ACCESS_TOKEN_KEY length:', process.env.ACCESS_TOKEN_KEY?.length);
  console.log(
    'REFRESH_TOKEN_KEY length:',
    process.env.REFRESH_TOKEN_KEY?.length,
  );
  const cacheService = new CacheService();
  const storageService = new StorageService(
    path.resolve(__dirname, '../uploads/images'),
  );
  const pool = new Pool();
  const collaborationsService = new CollaborationsService(pool);
  const playlistActivitiesService = new PlaylistActivitiesService(pool);
  const playlistsService = new PlaylistsService(
    pool,
    collaborationsService,
    playlistActivitiesService,
  );
  const albumsService = new AlbumsService(pool, cacheService);
  const songsService = new SongsService(pool);
  const usersService = new UsersService(pool);
  const authenticationsService = new AuthenticationsService(pool);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Number(process.env.ACCESS_TOKEN_AGE),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        storageService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: { service: songsService, validator: SongsValidator },
    },
    {
      plugin: users,
      options: { service: usersService, validator: UsersValidator },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: { service: playlistsService, validator: PlaylistsValidator },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistActivities,
      options: { playlistActivitiesService, playlistsService },
    },
    {
      plugin: albumLikes,
      options: { service: albumsService },
    },
    {
      plugin: exportsPlugin,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (response.isBoom) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.output.statusCode);
        return newResponse;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
