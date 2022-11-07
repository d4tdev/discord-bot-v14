const { ChatInputCommandInteraction, InteractionType } = require('discord.js');
require('dotenv').config();

module.exports = {
   name: 'interactionCreate',
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    */
   async execute(interaction, client) {
      if (interaction.isChatInputCommand()) {
         const command = client.commands.get(interaction.commandName);

         if (!command) {
            return interaction.reply({
               content: 'Lệnh này đang không sử dụng được.',
               ephemeral: true,
            });
         }

         if (command.developer && interaction.user.id !== process.env.DEV_ID) {
            return interaction.reply({
               content: 'Lệnh này chỉ dành cho nhà phát triển.',
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
                  content: 'Lệnh này đang không sử dụng được.',
                  ephemeral: true,
               });
            }
         } else command.execute(interaction, client);
      } else if (interaction.isAutocomplete()) {
         const command = client.commands.get(interaction.commandName);

         if (!command)
            return interaction.reply({
               content: 'Lệnh này đang không sử dụng được.',
               ephemeral: true,
            });

         try {
            await command.autocomplete(interaction, client);
         } catch (error) {
            console.log(error);
         }
      }
   },
};
