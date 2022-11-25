const {
   ChatInputCommandInteraction,
   EmbedBuilder,
   SlashCommandBuilder,
} = require('discord.js');

const ErrorHandler = require('../../../Functions/errorHandler');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('music')
      .setDescription('Chọn các lựa chọn (autoplay, loop, queue,...).')
      .addStringOption(
         options =>
            options
               .setName('option')
               .setDescription('Music settings.')
               .setRequired(true)
               .addChoices(
                  { name: '🔁 Toggle Repeat Mode', value: 'repeatmode' },
                  { name: '🔀 Shuffle', value: 'shuffle' },
                  // auto play
                  { name: '🔁 Toggle Auto Play', value: 'autoplay' },
                  // add a related song
                  { name: '🔁 Add a Related Song', value: 'relatedsong' }
               )
      ),
      
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      const { options, guild, member, channel } = interaction;

      const VoiceChannel = member.voice.channel;
      if (!VoiceChannel) {
         return ErrorHandler(
            interaction,
            '🚫 | Bạn phải ở trong một phòng Voice để sử dụng lệnh này !'
         );
      }

      const queue = await client.distube.getQueue(VoiceChannel);
      if (queue) {
         if (
            guild.members.me.voice.channelId &&
            VoiceChannel.id !== guild.members.me.voice.channelId
         ) {
            return ErrorHandler(
               interaction,
               `🚫 | Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
            );
         }
      }

      try {
         switch (options.getString('option')) {
            case 'repeatmode': {
               try {
                  await queue.setRepeatMode(
                     queue.repeatMode ? 0 : 1,
                     VoiceChannel
                  );

                  console.log(
                     `Sử dụng thành công lệnh /music repeatmode của ${member.user.tag}`
                  );
                  return interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setTitle('🔁 - Repeat Mode')
                           .setDescription(
                              `Repeat Mode is now **${
                                 queue.repeatMode ? 'on' : 'off'
                              }**.`
                           )
                           .setColor('#2a9454'),
                     ],
                  });
               } catch (err) {
                  return ErrorHandler(
                     interaction,
                     'Không có bài hát nào để repeat.'
                  );
               }
            }
            case 'shuffle': {
               try {
                  await queue.shuffle(VoiceChannel);

                  console.log(
                     `Sử dụng thành công lệnh /music shuffle của ${member.user.tag}`
                  );
                  return interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setTitle('🔀 - Shuffle')
                           .setDescription('Shuffled the queue.')
                           .setColor('#2a9454'),
                     ],
                  });
               } catch (err) {
                  return ErrorHandler(
                     interaction,
                     'Không có bài hát nào để shuffle.'
                  );
               }
            }
            case 'autoplay': {
               try {
                  await queue.toggleAutoplay(VoiceChannel);

                  console.log(
                     `Sử dụng thành công lệnh /music autoplay của ${member.user.tag}`
                  );
                  return interaction.reply({
                     embeds: [
                        new EmbedBuilder()

                           .setTitle('🔁 - Auto Play')
                           .setDescription(
                              `Auto Play is now ${
                                 queue.autoplay ? 'on' : 'off'
                              }.`
                           )
                           .setColor('#2a9454'),
                     ],
                  });
               } catch (err) {
                  return ErrorHandler(
                     interaction,
                     'Không có bài hát nào đang phát.'
                  );
               }
            }
            case 'relatedsong': {
               try {
                  await queue.addRelatedSong(VoiceChannel);

                  console.log(
                     `Sử dụng thành công lệnh /music relatedsong của ${member.user.tag}`
                  );
                  return interaction.reply({
                     embeds: [
                        new EmbedBuilder()
                           .setTitle('🔁 - Related Song')
                           .setDescription('Added a related song.')
                           .setColor('#2a9454'),
                     ],
                  });
               } catch (err) {
                  return ErrorHandler(
                     interaction,
                     'Không có bài hát nào đang phát.'
                  );
               }
            }
         }
      } catch (e) {
         console.log(e);
         return ErrorHandler(interaction, `Alert: ${e}`);
      }
   },
};
