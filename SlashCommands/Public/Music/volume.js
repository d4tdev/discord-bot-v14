const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('volume')
      .setDescription('Chỉnh âm lượng (1 - 200).')
      .addIntegerOption(option =>
         option
            .setName('percent')
            .setDescription('Provide the volume.')
            .setRequired(true)
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

      try {
         const percent = options.getInteger('percent');

         if (percent < 1 || percent > 200) {
            return ErrorHandler(
               interaction,
               '🔊 - Âm lượng phải trong khoảng 1 đến 200.'
            );
         }

         client.distube.setVolume(VoiceChannel, percent);

         console.log(`Sử dụng thành công lệnh /volume của ${member.user.tag}`);
         return interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setTitle('Volume')
                  .setColor('#2a9454')
                  .setDescription(`🔊 - Âm lượng được đặt ở **${percent}**%`),
            ],
         });
      } catch (e) {
         return ErrorHandler(interaction, `${e}`);
      }
   },
};
