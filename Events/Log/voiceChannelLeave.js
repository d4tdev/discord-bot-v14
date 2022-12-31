const { Message, EmbedBuilder, Client } = require('discord.js');
require('dotenv').config();
const VoiceLog = require('../../Schema/VoiceLog');

module.exports = {
   name: 'voiceChannelLeave',
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
               `**${member}** đã rời kênh **${channel.name}**\n🔹**Thông tin người dùng:**\n${member.user.username}#${member.user.discriminator} | ID: ${member.user.id}\n🔹**Thông tin kênh:**\n${channel.name} | ID: ${channel.id}`
            )
            .setColor('#FD5D5D')
            .setTimestamp();

         return await client.channels.cache
            .get(VoiceLogData.channelID)
            .send({ embeds: [embed] });
      } catch (err) {
         console.log(err);
      }
   },
};
