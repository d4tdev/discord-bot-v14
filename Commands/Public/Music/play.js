const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');
const axios = require('axios');

const ErrorHandler = require('../../../Functions/errorHandler');
require('dotenv').config();

module.exports = {
   data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Play a song.')
      .addStringOption(option =>
         option
            .setName('query')
            .setDescription('Provide the song name or link URL.')
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
      if (!focusedValue) {
         searchSuggestions = [
            'Đông Kiếm Em',
            '24h LyLy',
            'Chill Lofi',
            'Mr.Siro',
         ];
         await interaction.respond(
            searchSuggestions.map(choice => ({ name: choice, value: choice }))
         );
      }

      // const data = process.env.YT_URL + focusedValue + '&type=video&key=' + process.env.YT_API_KEY;
      const url = process.env.YT_URL + focusedValue;

      const response = await axios.get(url);
      console.log(response.data[1])
      const data = response.data[1];

      for (let i = 0; i < data.length; i++) {
         searchSuggestions.push(data[i]);
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
            'You need to in a Voice Channel to use this command.'
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
                  `You need to be in the same Voice Channel as me to use this command. Music is already being played in ${guild.members.me.voice.channel}`
               );
            }
         }
         const query = options.getString('query');

         await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setDescription(`🔍 | Looking for a song...`),
            ],
            ephemeral: true,
         });

         client.distube.play(VoiceChannel, query, {
            textChannel: channel,
            member: member,
         });

         await interaction.editReply({
            embeds: [
               new EmbedBuilder()
                  .setTitle('Playing')
                  .setColor('#2a9454')
                  .setDescription(`🎶 - Request received`),
            ],
            ephemeral: true,
         });
      } catch (e) {
         console.log(e);
         return ErrorHandler(interaction, `Alert: ${e}`);
      }
   },
};
