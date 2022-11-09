const {
   Message,
   EmbedBuilder,
   Client,
   ActionRowBuilder,
   ButtonBuilder,
   ButtonStyle,
} = require('discord.js');
require('dotenv').config();

module.exports = {
   name: 'messageCreate',
   once: true,
   /**
    * @param {Message} message
    * @param {Client} client
    **/
   async execute(message, client) {
      const { author, guild, content } = message;
      const { user } = client;

      if (!guild || author.bot) return;
      if (content.includes('@here') || content.includes('@everyone')) return;
      if (!content.includes(user.id)) return;

      const msgMention = message.mentions.users.first();
      if (msgMention) {
         if (msgMention.id === process.env.BOT_ID) {
            message
               .reply({
                  embeds: [
                     new EmbedBuilder()
                        .setColor('2a9454')
                        .setAuthor({
                           name: 'Xin chào bạn. Bạn đang tìm gì ở mình nhỉ',
                           iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                           }),
                        })
                        .setDescription(
                           'Gọi mình thì sử dụng Slash Command nhé (**/help** để xem các câu lệnh)!'
                        ),
                  ],
               })
               .then(msg => {
                  setTimeout(() => {
                     msg.delete().catch(err => {
                        if (err.code !== 10008) return console.log(err);
                     });
                  }, 10 * 1000);
               });
         }
      }

   },
};
