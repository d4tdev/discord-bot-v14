const { EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
   subCommand: 'queue.clear',
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
            return await interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setTitle('🚫 | Không có bài hát nào trong danh sách phát')
                     .setColor('Red'),
               ],
               ephemeral: true,
            });
         }

         // xóa toàn bộ danh sách phát
         client.player.getQueue(interaction.guildId).clearQueue();

         // thông báo thành công
         return await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setTitle('✅ - Xóa danh sách phát thành công')
                  .setDescription('Đã xóa toàn bộ danh sách phát')
                  .setColor('#2a9454'),
            ],
         });
      } catch (err) {
         console.log(err);
         return await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setDescription('🚫 | Đã có lỗi xảy ra. Vui lòng thử lại sau!')
                  .setColor('Red'),
            ],
            ephemeral: true,
         });
      }
   },
};
