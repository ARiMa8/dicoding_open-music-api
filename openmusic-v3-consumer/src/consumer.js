require("dotenv").config();
const amqp = require("amqplib");
const PlaylistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queue = "export:playlists";
  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(
    queue,
    async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString()
        );

        const playlistData = await playlistsService.getPlaylistSongs(
          playlistId
        );
        await mailSender.sendEmail(targetEmail, JSON.stringify(playlistData));

        console.log(
          `Email ekspor untuk playlist ${playlistId} telah dikirim ke ${targetEmail}`
        );
      } catch (error) {
        console.error(error);
      }
    },
    { noAck: true }
  );

  console.log(`Consumer berjalan, mendengarkan queue "${queue}"...`);
};

init();
