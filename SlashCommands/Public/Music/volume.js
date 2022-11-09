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
      .setDescription('Changes the volume (1 - 100).')
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
            'You need to in a Voice Channel to use this command.'
         );
      }

      const queue = await client.distube.getQueue(VoiceChannel);
      console.log(client.distube.getQueue(VoiceChannel));
      console.log('\n\n\n\n\n' + client.distube.getQueue(interaction));

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

      try {
         const percent = options.getInteger('percent');

         if (percent < 1 || percent > 100) {
            return ErrorHandler(
               interaction,
               '🔊 - Volume must be between 1 and 100.'
            );
         }

         client.distube.setVolume(VoiceChannel, percent);

         console.log('Sử dụng thành công lệnh /volume');
         return interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setTitle('Volume')
                  .setColor('#2a9454')
                  .setDescription(`🔊 - Volume set to **${percent}**`),
            ],
         });
      } catch (e) {
         return ErrorHandler(interaction, `Alert: ${e}`);
      }
   },
};
