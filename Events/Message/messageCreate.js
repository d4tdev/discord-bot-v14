const {
   Message,
   chatInputApplicationCommandMention,
   EmbedBuilder,
   Client,
} = require('discord.js');
require('dotenv').config();

module.exports = {
   name: 'messageCreate',
   aliases: [],
   usage: '',
   description: 'create a message',
   /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    **/
   async execute(message, client) {

      const msgMention = message.mentions.users.first();
      if (msgMention) {

         if (msgMention.id === process.env.BOT_ID) {
            message.reply(
               {
               embeds: [
                  new EmbedBuilder()
                     .setColor('2a9454')
                     .setDescription(
                        'Vui lòng sử dụng Slash Command (**/help** để xem các câu lệnh)!'
                     ),
               ],
            }

            );
         }
      }
      if (message.author.bot || !message.content.startsWith(process.env.PREFIX))
         return;
      if (message.channel.type === 'DM') return;
      if (message.author.id === process.env.BOT_ID) return;


      if (message.content.startsWith(process.env.PREFIX)) {
         const args = message.content
            .slice(process.env.PREFIX.length)
            .trim()
            .split(/ +/);
         const command = args.shift().toLowerCase();

         if (command === 'help') {
            message.reply({
               embeds: [
                  new EmbedBuilder()
                     .setColor('2a9454')
                     .setDescription(
                        'Vui lòng sử dụng Slash Command (**/help** để xem các câu lệnh)!'
                     ),
               ],
            });
         }
         if (command ==='play') {
            
         }
      }
   },
};
