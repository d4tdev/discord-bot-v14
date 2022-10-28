const {
   ChatInputCommandInteraction,
   SlashCommandBuilder,
} = require('discord.js');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   execute(interaction, client) {
      interaction.reply({
         content: `🏓 Pong!\nAPI Latency: ${client.ws.ping} ms\nBot Latency: ${ - interaction.createdTimestamp} ms`,
         ephemeral: true,
      });
   },
};
