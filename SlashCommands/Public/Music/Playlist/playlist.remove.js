const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.remove',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;

         const queueId = options.getString('playlist-id');
         const position = options.getInteger('song-position');

         const data = await Playlist.findOne({ _id: queueId }).catch(() => {
            return ErrorHandler(interaction, 'This playlist does not exist.');
         });

         if (data.userId !== user.id)
            return ErrorHandler(
               interaction,
               'You can only remove songs from your own playlist.'
            );

         const name = data.songs.name;
         const url = data.songs.url;

         const filtered = parseInt(position -1 );

         if (filtered > name.length - 1)
            return ErrorHandler(
               interaction,
               'Provide a valid song position, use `/playlist info` to check all the song positions.'
            );

         const afName = name.splice(filtered, 1);
         const afUrl = url.splice(filtered, 1);

         const rmvName = afName.filter(x => !name.includes(x));
         const rmvUrl = afUrl.filter(x => !url.includes(x));

         await data.save();

         interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setDescription(
                     `✅ | Successfully removed **[${rmvName}](${rmvUrl})** from Playlist`
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
