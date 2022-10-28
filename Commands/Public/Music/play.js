const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
   PermissionFlagsBits,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Play a song.')
      .setDefaultMemberPermissions(PermissionFlagsBits.CONNECT)
      .addStringOption(option =>
         option
            .setName('query')
            .setDescription('Provide the song name or link URL.')
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
         return ErrorHandler(interaction, `Alert: ${e}`);
      }
   },
};
