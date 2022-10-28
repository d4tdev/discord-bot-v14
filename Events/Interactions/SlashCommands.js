const { ChatInputCommandInteraction } = require('discord.js');
let config = require('../../config.json');

module.exports = {
   name: 'interactionCreate',
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    */
   execute(interaction, client) {
      if (!interaction.isChatInputCommand()) return;

      const command = client.commands.get(interaction.commandName);

      if (!command) {
         return interaction.reply({
            content: 'This command is outdated.',
            ephemeral: true,
         });
      }

      if (command.developer && interaction.user.id !== config.DevID) {
         return interaction.reply({
            content: 'This command is only for the developer.',
            ephemeral: true,
         });
      }
      const subCommand = interaction.options.getSubcommand(false);
      if (subCommand) {
         const subCommandFile = client.subCommands.get(
            `${interaction.commandName}.${subCommand}`
         );
         if (subCommandFile) {
            subCommandFile.execute(interaction, client);
         } else {
            return interaction.reply({
               content: 'This subcommand is outdated.',
               ephemeral: true,
            });
         }
      } else command.execute(interaction, client);
   },
};
