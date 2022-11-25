const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.info',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;

         const queueId = options.getString('playlist-id');

         const data = await Playlist.findOne({ _id: queueId }).catch(() => {
            return ErrorHandler(interaction, 'This playlist does not exist. Use \`/playlist list\` to see id of playlist');
         });

         const User = guild.members.cache.get(data.userId);

         let privacy;

         if (data.privacy === true) privacy = 'Private';
         else privacy = 'Public';

         const rawFields = data.songs.name;

         let index = 1;

         const fields = rawFields
            .map(field => {
               return [
                  `**${index++}.** [${field}](${data.songs.url[index - 2]})`,
               ].join('\n');
            })
            .join('\n');

         interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setTitle('📜 | Playlist Info')
                  .setDescription(
                     `**Name:** ${data.name.toUpperCase()}\n**ID:** ${queueId}\n**Privacy:** ${privacy}\n**Songs:**\n ${fields}\n**Created By:** ${User}`
                  )
                  .setThumbnail(guild.iconURL({ dynamic: true }))
                  .setFooter({
                     text: 'Powered by dd4tj#8572',
                  })
                  .setTimestamp(),
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
