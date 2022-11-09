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

      if (msgMention) return;
      if (message.author.bot || !message.content.startsWith(process.env.PREFIX))
         return;
      if (message.channel.type === 'DM') return;
      if (message.author.id === process.env.BOT_ID) return;

      if (message.content.startsWith(process.env.PREFIX)) {
         const args = message.content
            .slice(process.env.PREFIX.length)
            .trim()
            .split(/ +/);
         const commandName = args.shift().toLowerCase();

         const command =
            client.messages.get(commandName) ||
            client.messages.find(
               cmd => cmd.aliases && cmd.aliases.includes(commandName)
            );

         if (!command) return;

         if ( command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);

            if (!authorPerms || !authorPerms.has(command.permissions)) {
               return message.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setColor('RED')
                        .setDescription(
                           `Bạn không có quyền để sử dụng lệnh này!`
                        ),
                  ],
               });
            }
         }

         // const { cooldowns } = client;
         // if (!cooldowns.has(command.name)) {
         //    cooldowns.set(command.name, new Discord.Collection());
         // }

         // const now = Date.now();
         // const timestamps = cooldowns.get(command.name);
         // const cooldownAmount = (command.cooldown || 1) * 1000;

         // if (timestamps.has(message.author.id)) {
         //    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
         //    if (now < expirationTime) {
         //       const timeLeft = (expirationTime - now) / 1000;
         //       return message.reply({
         //          embeds: [
         //             new EmbedBuilder()
         //                .setColor('RED')
         //                .setDescription(
         //                   `Vui lòng chờ ${timeLeft.toFixed(
         //                      1
         //                   )} giây trước khi sử dụng lệnh này!`
         //                ),
         //          ],
         //       }).then(msg => {
         //          setTimeout(() => {
         //             msg.delete().catch(err => {
         //                if (err.code !== 10008) return console.log(err);
         //             });
         //          }, 7 * 1000);
         //       });
         //    }
         // }

         // timestamps.set(message.author.id, now);

         // setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

         try {
            command.execute(message, client, args);
         } catch (error) {
            console.error(error);
            message.reply({
               embeds: [
                  new EmbedBuilder()
                     .setColor('Red')
                     .setDescription(
                        `Có lỗi xảy ra khi thực hiện lệnh này!`
                     ),
               ],
            });
         }
         // if (command === 'help') {
         //    message.reply({
         //       embeds: [
         //          new EmbedBuilder()
         //             .setColor('2a9454')
         //             .setAuthor({
         //                name: 'Xin chào bạn. Bạn đang tìm gì ở mình nhỉ',
         //                iconURL: client.user.displayAvatarURL({
         //                   dynamic: true,
         //                }),
         //             })
         //             .setDescription(
         //                'Gọi mình thì sử dụng Slash Command nhé (**/help** để xem các câu lệnh)!'
         //             ),
         //       ],
         //    });
         // }
         // if (command === 'play') {
         // }
      }
   },
};
