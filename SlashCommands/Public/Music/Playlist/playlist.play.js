const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.play',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async autocomplete(interaction, client) {
      let searchSuggestions = [];

      let playlists = await Playlist.find({
         userId: interaction.user.id,
      });

      if (playlists) {
         playlists.forEach(playlist => {
            const User = client.users.cache.get(playlist.userId);

            searchSuggestions.push({
               name: `${playlist.name}<${playlist.id}> của ${User.username}\#${User.discriminator}`,
               value: playlist.id,
            });
         });

         await interaction.respond(searchSuggestions);
      }
   },
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;
         const VoiceChannel = member.voice.channel;
         if (!VoiceChannel) {
            return ErrorHandler(
               interaction,
               '🚫 | Bạn phải ở trong một phòng Voice để sử dụng lệnh này !'
            );
         }

         const queue = await client.distube.getQueue(VoiceChannel);
         if (queue) {
            if (
               guild.members.me.voice.channelId &&
               VoiceChannel.id !== guild.members.me.voice.channelId
            ) {
               return ErrorHandler(
                  interaction,
                  `🚫 | Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
               );
            }
         }

         const queueId = options.getString('playlist-id');

         const data = await Playlist.findOne({ _id: queueId }).catch(() => {
            return ErrorHandler(interaction, 'Danh sách phát không tồn tại');
         });

         if (data.privacy === true) {
            const User = client.users.cache.get(data.userId);

            if (data.userId !== user.id)
               return ErrorHandler(
                  interaction,
                  `Danh sách này ở chế độ private, chỉ có ${User.tag} mới sử dụng được.`
               );

            const songs = data.songs.url;
            const names = data.songs.name;

            if (!songs?.length)
               return ErrorHandler(
                  interaction,
                  'Danh sách này trống. Vui lòng sử dụng `/playlist add` để thêm bài hát.'
               );

            const playlist = await client.distube.createCustomPlaylist(songs, {
               member,
               properties: { name: `${names}` },
               parallel: true,
            });

            await client.distube.play(VoiceChannel, playlist, {
               textChannel: channel,
               member,
            });

            interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setColor('#2a9454')
                     .setDescription(
                        `✅ | Danh sách có ID: **${queueId}** đã được phát.`
                     ),
               ],
            });
         } else {
            const songs = data.songs.url;
            const names = data.songs.name.toUpperCase();

            if (songs?.length)
               return ErrorHandler(
                  interaction,
                  'Danh sách này trống. Vui lòng sử dụng `/playlist add` để thêm bài hát.'
               );

            const playlist = await client.distube.createCustomPlaylist(songs, {
               member,
               properties: { name: `${names}` },
               parallel: true,
            });

            await client.distube.play(VoiceChannel, playlist, {
               textChannel: channel,
               member,
            });

            interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setColor('#2a9454')
                     .setDescription(
                        `✅ | Danh sách có ID: **${queueId}** đã được phát.`
                     ),
               ],
            });
         }
      } catch (err) {
         console.log(err);
         return ErrorHandler(
            interaction,
            'Something went wrong, please try again later.'
         );
      }
   },
};
