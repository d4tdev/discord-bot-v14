const {
   ChatInputCommandInteraction,
   SlashCommandBuilder,
} = require('discord.js');

module.exports = {
   category: 'Info',
   data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong! and latency'),
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   execute(interaction, client) {
      interaction.reply({
         content: `🏓 Pong!\nAPI Latency: ${Math.round(client.ws.ping)} ms\nBot Latency: ${Date.now() - interaction.createdTimestamp} ms`,
         ephemeral: true,
      });
   },
};
