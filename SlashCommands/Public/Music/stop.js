const {
   EmbedBuilder,
   SlashCommandBuilder,
   ChatInputCommandInteraction,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Dừng phát nhạc và xóa danh sách phát hiện tại.'),
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
            await queue.stop(VoiceChannel);

            console.log(`Sử dụng thành công lệnh /stop của ${member.user.tag}`);
            return interaction.reply({
               embeds: [
                  new EmbedBuilder()
                     .setTitle('⏹ - Đã dừng')
                     .setDescription('Đã dừng phát nhạc')
                     .setColor('#2a9454'),
               ],
            });
         } catch (err) {
            console.log(err);
            return ErrorHandler(interaction, 'Không có bài hát nào để dừng.');
         }
      } else {
         return ErrorHandler(interaction, 'Không có bài hát nào để dừng.');
      }
   },
};
