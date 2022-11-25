const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.privacy',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;

         const playlistId = options.getString('playlist-id');
         const choices = options.getString('options');

         let data = await Playlist.findOne({
            userId: user.id,
            _id: playlistId,
         });

         if (!data) {
            return ErrorHandler(interaction, 'You do not have any playlist.');
         }

         if (user.id !== data.userId) {
            return ErrorHandler(
               interaction,
               'You do not have permission to change the privacy mode of this playlist.'
            );
         }

         switch (choices) {
            case 'public':
               {
                  if (data.privacy === false)
                     return ErrorHandler(
                        interaction,
                        'This playlist is already public.'
                     );

                  data.privacy = false;
                  await data.save();

                  interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setColor('#2a9454')
                           .setDescription(
                              `✅ | The privacy mode of the playlist **${data.name.toUpperCase()}** has been changed to **PUBLIC**`
                           ),
                     ],
                  });
               }
               break;
            case 'private':
               {
                  if (data.privacy === true)
                     return ErrorHandler(
                        interaction,
                        'This playlist is already private.'
                     );

                  data.privacy = true;
                  await data.save();

                  interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setColor('#2a9454')
                           .setDescription(
                              `✅ | The privacy mode of the playlist **${data.name.toUpperCase()}** has been changed to **PRIVATE**`
                           ),
                     ],
                  });
               }
               break;
         }
      } catch (err) {
         console.log(err);
         return ErrorHandler(
            interaction,
            'Something went wrong, please try again later.'
         );
      }
   },
};
