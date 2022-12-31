const { Message, EmbedBuilder, Client } = require('discord.js');
require('dotenv').config();
const VoiceLog = require('../../Schema/VoiceLog');

module.exports = {
   name: 'voiceChannelJoin',
   /**
    * @param {Message} message
    * @param {Client} client
    * @param {String[]} args
    */
   async execute(member, channel, client) {
      try {
         const VoiceLogData = await VoiceLog.findOne({
            guildID: member.guild.id,
         });

         if (!VoiceLogData) return;

         const embed = new EmbedBuilder()
            .setAuthor({
               name: member.nickname,
               iconURL: member.displayAvatarURL(),
            })
            .setDescription(
               `**${member}** đã vào kênh **${member.voice.channel}**\n**🔹Thông tin người dùng:**\n${member.user.username}#${member.user.discriminator} | ID: ${member.user.id}\n**🔹Thông tin kênh:**\n${member.voice.channel} | ID: ${member.voice.channelId}`
            )
            .setColor('#2a9454')
            .setTimestamp();

         return await client.channels.cache
            .get(VoiceLogData.channelID)
            .send({ embeds: [embed] });
      } catch (err) {
         console.log(err);
      }
   },
};
