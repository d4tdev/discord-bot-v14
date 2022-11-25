const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('pause')
      .setDescription('Tạm dừng phát nhạc.'),
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
            await queue.pause(VoiceChannel);

            console.log(
               `Sử dụng thành công lệnh /pause của ${member.user.tag}`
            );
            return interaction.reply({
               embeds: [
                  new EmbedBuilder()

                     .setTitle('⏸ - Đã tạm dừng')
                     .setDescription(
                        `Đã tạm dừng phát nhạc. Sử dụng \`/resume\` để tiếp tục phát nhạc.`
                     )
                     .setColor('#2a9454'),
               ],
            });
         } catch (err) {
            console.log(err);
            return ErrorHandler(interaction, 'Không có bài hát nào để tạm dừng.');
         }
      } else {
         return ErrorHandler(interaction, 'Không có bài hát nào để tạm dừng.');
      }
   },
};
