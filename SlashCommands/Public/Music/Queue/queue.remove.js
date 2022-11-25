const { EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');

module.exports = {
   subCommand: 'queue.remove',
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

         // xóa 1 bài hát trong danh sách phát
         const songIndex = options.getInteger('song-number');

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
            return interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setTitle('🚫 | Không có bài hát nào trong danh sách phát')
                     .setColor('Red'),
               ],
               ephemeral: true,
            });
         }

         // nếu số thứ tự của bài hát không hợp lệ
         if (songIndex < 1 || songIndex > queue.length) {
            return await interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setTitle('🚫 | Số thứ tự của bài hát không hợp lệ')
                     .setColor('Red'),
               ],
               ephemeral: true,
            });
         }

         if (songIndex === 1) {
            return await interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setTitle('🚫 | Không thể xóa bài hát đang được phát')
                     .setColor('Red'),
               ],
               ephemeral: true,
            });
         }

         // xóa bài hát thứ i trong danh sách phát
         let song = queue.songs.splice(songIndex - 1, 1);

         // thông báo thành công
         const msg = await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setTitle('✅ - Xóa bài hát thành công')
                  .setDescription(
                     `Đã xóa bài hát **${song[0].name}** khỏi danh sách phát`
                  )
                  .setColor('#2a9454'),
            ],
         });
         setTimeout(() => {
            msg.delete();
         }, 5 * 1000);
      } catch (err) {
         console.log(err);
         return ErrorHandler(
            interaction,
            'Đã có lỗi xảy ra. Vui lòng thử lại sau!'
         );
      }
   },
};
