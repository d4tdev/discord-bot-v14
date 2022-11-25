const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.delete',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;

         const queueId = options.getString('playlist-id');

         const data = await Playlist.findOne({ _id: queueId }).catch(() => {
            return ErrorHandler(interaction, 'This playlist does not exist.');
         });

         if (data.userId !== user.id)
            return ErrorHandler(
               interaction,
               'You can only delete your own playlist.'
            );

         await Playlist.deleteOne({ _id: queueId });

         interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setDescription(
                     `✅ | Successfully deleted Playlist of associated ID: **${queueId}**`
                  ),
            ],
         });
      } catch (err) {
         console.log(err);
         return ErrorHandler(
            interaction,
            'Something went wrong, please try again later.'
         );
      }
   },
};
