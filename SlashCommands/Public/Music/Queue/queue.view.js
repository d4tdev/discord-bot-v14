const { EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');

module.exports = {
   subCommand: 'queue.view',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
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

         if (
            guild.members.me.voice.channelId &&
            VoiceChannel.id !== guild.members.me.voice.channelId
         ) {
            return ErrorHandler(
               interaction,
               `🚫 | Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
            );
         }
         // nếu không có bài hát nào trong danh sách phát
         if (!queue) {
            return await interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setTitle('🚫 | Không có bài hát nào trong danh sách phát')
                     .setColor('Red'),
               ],
               ephemeral: true,
            });
         }

         try {
            const tracks = queue.songs.map(
               (song, i) =>
                  `**${i + 1}** - [${song.name}](${song.url}) | ${
                     song.formattedDuration
                  } Request by: ${song.user}`
            );
            const nextSongs =
               queue.songs.length > 10
                  ? `And **${queue.songs.length - 10}** songs...`
                  : `Playlist **${queue.songs.length}** songs...`;

            let QueueEmbed = new EmbedBuilder()
               .setTitle('📜 - Queue')

               .setColor('#2a9454')
               .setAuthor({
                  name: 'Queue',
                  iconURL: client.user.displayAvatarURL(),
               })
               .setDescription(
                  `${tracks.slice(0, 10).join('\n')}\n\n${nextSongs}`
               )
               .addFields([
                  {
                     name: '> Đang phát:',
                     value: `[${queue.songs[0].name}](${queue.songs[0].url}) - ${queue.songs[0].formattedDuration} | Yêu cầu bởi: ${queue.songs[0].user}`,
                     inline: true,
                  },
                  {
                     name: '> Tổng thời gian:',
                     value: `${queue.formattedDuration}`,
                     inline: true,
                  },
                  {
                     name: '> Tổng bài hát:',
                     value: `${queue.songs.length}`,
                     inline: true,
                  },
               ]);

            console.log(
               `Sử dụng thành công lệnh /queue của ${member.user.tag}`
            );
            return interaction.reply({
               embeds: [QueueEmbed],
            });
         } catch (err) {
            console.log(err);
            return ErrorHandler(interaction, 'Không có bài hát nào đang phát.');
         }
      } catch (err) {
         console.log(err);
         return ErrorHandler(interaction, 'Đã có lỗi xảy ra!');
      }
   },
};
