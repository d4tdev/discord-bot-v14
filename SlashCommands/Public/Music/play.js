const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');
const axios = require('axios');

const ErrorHandler = require('../../../Functions/errorHandler');
require('dotenv').config();

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Phát một bài hát hoặc một list nhạc.')
      .addStringOption(option =>
         option
            .setName('query')
            .setDescription('Nhập tên bài hoặc link URL.')
            .setRequired(true)
            .setAutocomplete(true)
      ),

   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async autocomplete(interaction, client) {
      let focusedValue = interaction.options.getFocused();
      let searchSuggestions = [];
      if (focusedValue === '') {
         searchSuggestions = [
            'Đông Kiếm Em',
            '24h LyLy',
            'Chill Lofi',
            'Mr.Siro',
         ];
         return await interaction.respond(
            searchSuggestions.map(choice => ({ name: choice, value: choice }))
         );
      }

      // const data = process.env.YT_URL + focusedValue + '&type=video&key=' + process.env.YT_API_KEY;
      const url =
         'http://suggestqueries.google.com/complete/search?client=chrome&output=json&ds=yt&q=' +
         encodeURIComponent(focusedValue);

      const response = await axios.get(url, { responseType: 'arraybuffer' });

      let data = [];
      data = JSON.parse(response.data.toString('latin1'))[1].map(
         item =>
            new Object({
               value: item,
            })
      );

      // nowValue, ...suggestValue
      data = [
         {
            value: focusedValue,
         },
         ...data,
      ];

      for (let i = 0; i < data.length; i++) {
         searchSuggestions.push(data[i].value);
      }

      await interaction.respond(
         searchSuggestions.map(choice => ({
            name: choice,
            value: choice,
         }))
      );
   },
   async execute(interaction, client) {
      const { options, guild, member, channel } = interaction;

      const VoiceChannel = member.voice.channel;
      if (!VoiceChannel) {
         return ErrorHandler(
            interaction,
            'Bạn phải ở trong một phòng Voice để sử dụng lệnh này !'
         );
      }

      const queue = await client.distube.getQueue(VoiceChannel);

      try {
         if (queue) {
            if (
               guild.members.me.voice.channelId &&
               VoiceChannel.id !== guild.members.me.voice.channelId
            ) {
               return ErrorHandler(
                  interaction,
                  `Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
               );
            }
         }
         const query = options.getString('query');

         await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setDescription(`🔍 | Đang tìm kiếm...`),
            ],
            ephemeral: true,
         });

         client.distube.play(VoiceChannel, query, {
            textChannel: channel,
            member: member,
         });

         console.log('Sử dụng thành công lệnh /play');
         await interaction.editReply({
            embeds: [
               new EmbedBuilder()
                  .setTitle('Phát nhạc')
                  .setColor('#2a9454')
                  .setDescription(`🎶 - Yêu cầu đã được thêm vào hàng chờ.`),
            ],
            ephemeral: true,
         });
      } catch (e) {
         console.log(e);
         return ErrorHandler(interaction, `Alert: ${e}`);
      }
   },
};
