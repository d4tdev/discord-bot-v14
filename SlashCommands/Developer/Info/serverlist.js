const {
   SlashCommandBuilder,
   EmbedBuilder,
   PermissionFlagsBits,
   ChatInputCommandInteraction,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Developer',
   developer: true,
   data: new SlashCommandBuilder()
      .setName('server-list')
      .setDescription('Get list of servers that bot is in.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    **/
   async execute(interaction, client) {
      try {
         let arrays = [];
         client.guilds.cache.forEach(guild => {
            arrays.push(
               `🔹 Name: **${guild.name}** - Owner: <@${guild.ownerId}> - Members Count: **${guild.memberCount}**`
            );
         });

         await interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setAuthor({
                     name: 'Danh sách các server mà bot đang ở',
                     iconURL: client.user.avatarURL(),
                  })
                  .setColor('#2a9454')
                  .setTitle(`Tổng số server: ${client.guilds.cache.size}`)
                  .setDescription(arrays.map(array => array).join('\n')),
            ],
         });
      } catch (err) {
         ErrorHandler(interaction, err);
      }
   },
};
