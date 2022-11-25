const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const Playlist = require('../../../../Schema/Playlist');
const ErrorHandler = require('../../../../Functions/errorHandler');

module.exports = {
   subCommand: 'playlist.add',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;
         const queueId = options.getString('playlist-id');
         const song = options.getString('song-name');

         const data = await Playlist.findOne({ _id: queueId }).catch(() => {
            return ErrorHandler(interaction, 'This playlist does not exist.');
         });

         if (data.userId !== user.id)
            return ErrorHandler(
               interaction,
               'You can only add songs to your own playlist.'
            );

         const songData = await client.distube
            .search(song, { limit: 1 })
            .catch(() => {
               return ErrorHandler(interaction, 'No songs found.');
            });

         const url = songData[0].url;
         const name = songData[0].name;

         if (data.songs.url.includes(url))
            return ErrorHandler(
               interaction,
               'This song is already in the playlist.'
            );

         data.songs.url.push(url);
         data.songs.name.push(name);
         await data.save();

         interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setTitle('📜 | Playlist Info')
                  .setDescription(
                     `✅ | Successfully added **[${name}](${url})** into Playlist`
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
