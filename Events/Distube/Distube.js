const client = require('../../index');
const { EmbedBuilder } = require('discord.js');

const Format = Intl.NumberFormat();
const status = queue =>
   `Âm lượng: \`${queue.volume}%\` | Lọc: \`${
      queue.filters.names.join(', ') || 'Off'
   }\` | Loop: \`${
      queue.repeatMode
         ? queue.repeatMode === 2
            ? 'All Queue'
            : 'This Song'
         : 'Off'
   }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
   .on('playSong', async (queue, song) => {
      const result = await queue.textChannel.send({
         embeds: [
            new EmbedBuilder()
               .setColor('#2a9454')
               .setAuthor({
                  name: 'Đang phát',
                  iconURL: client.user.avatarURL(),
               })
               .setDescription(`> [**${song.name}**](${song.url})`)
               .setThumbnail(song.user.displayAvatarURL())
               .addFields([
                  {
                     name: '🔷 | Trạng thái',
                     value: `${status(queue).toString()}`,
                     inline: false,
                  },
                  {
                     name: '👀 | Lượt xem',
                     value: `${Format.format(song.views)}`,
                     inline: true,
                  },
                  {
                     name: '⏱️ | Thời gian',
                     value: `${song.formattedDuration}`,
                     inline: true,
                  },
                  {
                     name: '👌 | Yêu cầu bởi',
                     value: `${song.user}`,
                     inline: true,
                  },
                  {
                     name: '📻 | Phát tại',
                     value: `
┕🔊 | ${client.channels.cache.get(queue.voiceChannel.id)}
┕🪄 | ${queue.voiceChannel.bitrate / 1000}  kbps`,
                     inline: false,
                  },
                  {
                     name: '🤖 | Gợi ý bài tiếp theo',
                     value: `[${song.related[0].name}](${song.related[0].url})
┕⌛ | Time: ${song.related[0].formattedDuration} | 🆙 | Upload lên bởi: [${song.related[0].uploader.name}](${song.related[0].uploader.url})`,
                     inline: false,
                  },
               ])
               .setImage(song.thumbnail)
               .setFooter({
                  text: `${Format.format(
                     queue.songs.length
                  )} bài hát trong hàng đợi`,
               }),
         ],
      });

      setTimeout(() => {
         result.delete();
      }, 1000 * 60 * 2);
   })

   .on('addSong', async (queue, song) =>
      // queue.textChannel.send(
      //    `✅ | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
      // )
      {
         const result = await queue.textChannel.send({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setAuthor({
                     name: 'Đã thêm vào hàng đợi',
                     iconURL: client.user.avatarURL(),
                  })
                  .setDescription(`> [**${song.name}**](${song.url})`)
                  .setThumbnail(song.user.displayAvatarURL())
                  .addFields([
                     {
                        name: '👀 | Lượt xem',
                        value: `${Format.format(song.views)}`,
                        inline: true,
                     },
                     {
                        name: '⏱️ | Thời gian',
                        value: `${song.formattedDuration}`,
                        inline: true,
                     },
                     {
                        name: '👌 | Yêu cầu bởi',
                        value: `${song.user}`,
                        inline: true,
                     },
                  ])
                  .setImage(song.thumbnail)
                  .setFooter({
                     text: `${Format.format(
                        queue.songs.length
                     )} bài hát trong hàng đợi`,
                  }),
            ],
         });

         setTimeout(() => {
            result.delete();
         }, 1000 * 60 * 2);
      }
   )
   .on('addList', async (queue, playlist) =>
      // queue.textChannel.send(
      //    `✅ | Added \`${playlist.name}\` playlist (${
      //       playlist.songs.length
      //    } songs) to queue\n${status(queue)}`
      // )
      {
         const results = await queue.textChannel.send({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setAuthor({
                     name: 'Đã thêm vào hàng đợi',
                     iconURL: client.user.avatarURL(),
                  })
                  .setDescription(`> [**${playlist.name}**](${playlist.url})`)
                  .setThumbnail(playlist.thumbnail)
                  .addFields([
                     {
                        name: '👀 | Lượt xem',
                        value: `${Format.format(playlist.views)}`,
                        inline: true,
                     },
                     {
                        name: '⏱️ | Thời gian',
                        value: `${playlist.formattedDuration}`,
                        inline: true,
                     },
                     {
                        name: '👌 | Được yêu cầu bởi',
                        value: `${playlist.user}`,
                        inline: true,
                     },
                  ])
                  .setImage(playlist.thumbnail)
                  .setFooter({
                     text: `${Format.format(
                        queue.songs.length
                     )} bài hát trong hàng đợi`,
                  }),
            ],
         });

         setTimeout(() => {
            results.delete();
         }, 1000 * 60 * 2);
      }
   )
   .on('error', async (channel, e) => {
      // if (channel)
      //    channel.send(
      //       `❌ | An error encountered: ${e.toString().slice(0, 1974)}`
      //    );
      // else console.error(e);
      if (channel) {
         console.log(e);
         const result = await channel.send({
            embeds: [
               new EmbedBuilder()
                  .setColor('Red')
                  .setDescription(
                     `🚫 | Oops! Một lỗi đã xảy ra\n\n** ${e
                        .toString()
                        .slice(0, 1974)}**`
                  ),
            ],
         });

         setTimeout(() => {
            result.delete();
         }, 1000 * 60 * 1);
      } else console.log(e);
   })
   .on('empty', async queue => {
      const result = await queue.textChannel.send({
         embeds: [
            new EmbedBuilder()
               .setColor('Red')
               .setDescription(`🚫 | Phòng không còn ai nữa, cô đơn quá :(`),
         ],
      });

      setTimeout(() => {
         result.delete();
      }, 1000 * 60 * 1);
   })
   .on('searchNoResult', async (message, query) =>
      // message.channel.send(`❌ | No result found for \`${query}\`!`)
      {
         const result = await message.channel.send({
            embeds: [
               new EmbedBuilder()
                  .setColor('Red')
                  .setDescription(
                     `🚫 | Không tìm thấy kết quả cho \`${query}\`!`
                  ),
            ],
         });

         setTimeout(() => {
            result.delete();
         }, 1000 * 60 * 1);
      }
   )
   .on('finish', async queue => {
      const result = await queue.textChannel.send({
         embeds: [
            new EmbedBuilder()
               .setColor('#2a9454')
               .setDescription(
                  `🚫 | Tất cả bài hát trong playlist đã phát xong!`
               ),
         ],
      });
      setTimeout(() => {
         result.delete();
      }, 1000 * 60 * 1);
   })
   .on('noRelated', async queue => {
      const result = await queue.textChannel.send({
         embeds: [
            new EmbedBuilder()
               .setColor('Red')
               .setDescription(`🚫 | Bài hát không tìm thấy!`),
         ],
      });
      setTimeout(() => {
         result.delete();
      }, 1000 * 60 * 1);
   })
   .on('initQueue', async queue => {
      // queue.autoplay = true;
      queue.volume = 100;
   });
