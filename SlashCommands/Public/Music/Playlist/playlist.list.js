const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.list',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;

         const choices = options.getString('options');

         switch (choices) {
            case 'public': {
               const data = await Playlist.find({
                  privacy: false,
               });

               if (!data?.length) {
                  return ErrorHandler(
                     interaction,
                     'Không có danh sách phát nào được công khai.'
                  );
               }

               let index = 1;

               const queueData = data
                  .map(queue => {
                     return [
                        `**${index++}.** ${queue.name.toUpperCase()} - \`${
                           queue._id
                        }\``,
                     ].join('\n');
                  })
                  .join('\n');

               interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setColor('#2a9454')
                        .setTitle('📃 | Danh sách phát công khai')
                        .setDescription(`${queueData}`)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setFooter({
                           text: 'Powered by dd4tj#8572',
                        })
                        .setTimestamp(),
                  ],
               });
            }
            case 'private':
               {
                  const data = await Playlist.find({
                     userId: user.id,
                     privacy: true,
                  });

                  if (!data?.length) {
                     return ErrorHandler(
                        interaction,
                        'Bạn không có danh sách phát riêng tư nào.'
                     );
                  }

                  let index = 1;

                  const queueData = data
                     .map(queue => {
                        return [
                           `**${index++}.** ${queue.name.toUpperCase()} - \`${
                              queue._id
                           }\``,
                        ].join('\n');
                     })
                     .join('\n');

                  interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setColor('#2a9454')
                           .setTitle('📃 | Danh sách phát riêng tư')
                           .setDescription(`${queueData}`)
                           .setThumbnail(guild.iconURL({ dynamic: true }))
                           .setFooter({
                              text: 'Powered by dd4tj#8572',
                           })
                           .setTimestamp(),
                     ],
                  });
               }
               break;
         }
      } catch (err) {
         console.log(err);

         return ErrorHandler(
            interaction,
            'Có lỗi xảy ra. Vui lòng thử lại sau!'
         );
      }
   },
};
