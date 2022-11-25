const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('skip')
      .setDescription('Bỏ qua bài hát hiện tại.')
      .addIntegerOption(option =>
         option
            .setName('song-number')
            .setDescription('Số thứ tự của bài hát trong danh sách phát.')
      ),
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      const { options, guild, member, channel } = interaction;

      const VoiceChannel = member.voice.channel;
      if (!VoiceChannel) {
         return ErrorHandler(
            interaction,
            '🚫 | Bạn phải ở trong một phòng Voice để sử dụng lệnh này !'
         );
      }

      if (
         guild.members.me.voice.channelId &&
         VoiceChannel.id !== guild.members.me.voice.channelId
      ) {
         return ErrorHandler(
            interaction,
            `🚫 | Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
         );
      }

      const queue = await client.distube.getQueue(VoiceChannel);
      if (queue) {
         try {
            const id = options.getInteger('song-number');

            if (!id) {
               await queue.skip(VoiceChannel);
               console.log(
                  `Sử dụng thành công lệnh /music skip của ${member.user.tag}`
               );
               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setTitle('⏭ - Skipped')
                        .setDescription('Đã bỏ qua bài hát!')
                        .setColor('#2a9454'),
                  ],
               });
            } else {
               if (id === 1) {
                  return interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setColor('RED')
                           .setDescription(
                              `🚫 | Không thể chọn bài hát đang phát để qua!`
                           ),
                     ],
                  });
               }

               if (id > queue.songs.length || id < 1) {
                  return interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setColor('Red')
                           .setDescription(
                              `🚫 | Không tìm thấy bài hát có ID: ${id}!`
                           ),
                     ],
                  });
               }

               await client.distube.jump(message, parseInt(id - 1));

               console.log('Sử dụng thành công lệnh /skip');
               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setColor('#2a9454')
                        .setDescription(
                           `⏩ | Đã chuyển sang bài hát có ID: ${id}!`
                        ),
                  ],
               });
            }
         } catch (err) {
            console.log(err);
            return ErrorHandler(interaction, 'Không có bài hát nào để bỏ qua.');
         }
      } else {
         return ErrorHandler(interaction, 'Không có bài hát nào để bỏ qua.');
      }
   },
};
