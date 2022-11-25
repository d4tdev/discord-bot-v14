const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('repeat')
      .setDescription('Chọn lặp bài hát hoặc danh sách hiện tại.')
      .addStringOption(options =>
         options
            .setName('option')
            .setDescription('Music settings.')
            .setRequired(true)
            .addChoices(
               { name: 'Tắt', value: 'off' },
               { name: 'Bài hát hiện tại', value: 'song' },
               { name: 'Danh sách hiện tại', value: 'queue' }
            )
      ),
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   // async execute(interaction, client) {
   //    const { options, guild, member, channel } = interaction;

   //    const VoiceChannel = member.voice.channel;
   //    if (!VoiceChannel) {
   //       return ErrorHandler(
   //          interaction,
   //          '🚫 | Bạn phải ở trong một phòng Voice để sử dụng lệnh này !'
   //       );
   //    }

   //    if (
   //       guild.members.me.voice.channelId &&
   //       VoiceChannel.id !== guild.members.me.voice.channelId
   //    ) {
   //       return ErrorHandler(
   //          interaction,
   //          `🚫 | Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
   //       );
   //    }

   //    const queue = await client.distube.getQueue(VoiceChannel);
   //    if (queue) {
   //       try {
   //       } catch (err) {
   //          console.log(err);
   //          return ErrorHandler(
   //             interaction,
   //             'Không có bài hát nào để tạm dừng.'
   //          );
   //       }
   //    } else {
   //       return ErrorHandler(interaction, 'Không có bài hát nào để tạm dừng.');
   //    }
   // },
};
