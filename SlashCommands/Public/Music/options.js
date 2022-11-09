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
      .setDescription(
         'Chọn các lựa chọn (stop, autoplay, loop, queue, skip,...).'
      )
      .addStringOption(
         options =>
            options
               .setName('option')
               .setDescription('Music settings.')
               .setRequired(true)
               .addChoices(
                  { name: '⏸ Pause', value: 'pause' },
                  { name: '⏯ Resume', value: 'resume' },
                  { name: '⏭ Skip', value: 'skip' },
                  { name: '⏹ Stop', value: 'stop' },
                  { name: '🔁 Toggle Repeat Mode', value: 'repeatmode' },
                  { name: '🔀 Shuffle', value: 'shuffle' },
                  // auto play
                  { name: '🔁 Toggle Auto Play', value: 'autoplay' },
                  // view queue
                  { name: '📜 View Queue', value: 'queue' },
                  // add a related song
                  { name: '🔁 Add a Related Song', value: 'relatedsong' }
               )
         // .addSubcommand(subCommand =>
         //    subCommand.setName('pause').setDescription('Pause the song.')
         // )
         // .addSubcommand(subCommand =>
         //    subCommand.setName('resume').setDescription('Resume the song.')
         // )
         // .addSubcommand(subCommand =>
         //    subCommand.setName('skip').setDescription('Skip the song.')
         // )
         // .addSubcommand(subCommand =>
         //    subCommand.setName('stop').setDescription('Stop the song.')
         // )
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
            'You need to in a Voice Channel to use this command.'
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
               `You need to be in the same Voice Channel as me to use this command. Music is already being played in ${guild.members.me.voice.channel}`
            );
         }
      }

      try {
         switch (options.getString('option')) {
            case 'pause': {
               await queue.pause(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()

                        .setTitle('⏸ - Paused')
                        .setDescription(
                           `Paused the song. Use \`/music resume\` to resume the song.`
                        )
                        .setColor('#2a9454'),
                  ],
               });
            }
            case 'resume': {
               await queue.resume(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setTitle('⏯ - Resumed')
                        .setDescription(
                           `Resumed the song. Use \`/music pause\` to pause the song.`
                        )
                        .setColor('#2a9454'),
                  ],
               });
            }
            case 'skip': {
               await queue.skip(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setTitle('⏭ - Skipped')
                        .setDescription('Skipped the song.')
                        .setColor('#2a9454'),
                  ],
               });
            }
            case 'stop': {
               await queue.stop(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setTitle('⏹ - Stopped')
                        .setDescription('Stopped the song.')
                        .setColor('#2a9454'),
                  ],
               });
            }
            case 'repeatmode': {
               await queue.setRepeatMode(
                  queue.repeatMode ? 0 : 1,
                  VoiceChannel
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
            }
            case 'shuffle': {
               await queue.shuffle(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setTitle('🔀 - Shuffle')
                        .setDescription('Shuffled the queue.')
                        .setColor('#2a9454'),
                  ],
               });
            }
            case 'autoplay': {
               await queue.toggleAutoplay(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()

                        .setTitle('🔁 - Auto Play')
                        .setDescription(
                           `Auto Play is now ${queue.autoplay ? 'on' : 'off'}.`
                        )
                        .setColor('#2a9454'),
                  ],
               });
            }
            case 'queue': {
               const tracks = queue.songs.map(
                  (song, i) =>
                     `**${i + 1}** - [${song.name}](${song.url}) | ${
                        song.formattedDuration
                     } Request by: ${song.user}`
               );
               const nextSongs =
                  queue.songs.length > 10
                     ? `And **${queue.songs.length - 10}** songs...`
                     : `Playlist **${queue.songs.length}** songs...`;

               let QueueEmbed = new EmbedBuilder()
                  .setTitle('📜 - Queue')

                  .setColor('#2a9454')
                  .setAuthor({
                     name: 'Queue',
                     iconURL: client.user.displayAvatarURL(),
                  })
                  .setDescription(
                     `${tracks.slice(0, 10).join('\n')}\n\n${nextSongs}`
                  )
                  .addFields([
                     {
                        name: '> Playing:',
                        value: `[${queue.songs[0].name}](${queue.songs[0].url}) - ${queue.songs[0].formattedDuration} | Request by bởi: ${queue.songs[0].user}`,
                        inline: true,
                     },
                     {
                        name: '> Total times:',
                        value: `${queue.formattedDuration}`,
                        inline: true,
                     },
                     {
                        name: '> Total songs:',
                        value: `${queue.songs.length}`,
                        inline: true,
                     },
                  ]);

               return interaction.reply({
                  embeds: [QueueEmbed],
               });
            }
            case 'relatedsong': {
               await queue.addRelatedSong(VoiceChannel);

               return interaction.reply({
                  embeds: [
                     new EmbedBuilder()
                        .setTitle('🔁 - Related Song')
                        .setDescription('Added a related song.')
                        .setColor('#2a9454'),
                  ],
               });
            }
         }
      } catch (e) {
         console.log(e);
         return ErrorHandler(interaction, `Alert: ${e}`);
      }
   },
};
