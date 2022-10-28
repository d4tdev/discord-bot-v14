const { EmbedBuilder } = require('discord.js');

function ErrorHandler(interaction, description) {
   return interaction.reply({
      embeds: [
         new EmbedBuilder()
            .setTitle('‼ - Something went wrong')
            .setDescription(description)
            .setColor('Red'),
      ],
   });
}

module.exports = ErrorHandler;
