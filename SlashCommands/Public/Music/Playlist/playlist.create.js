const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

const ErrorHandler = require('../../../../Functions/errorHandler');
const Playlist = require('../../../../Schema/Playlist');

module.exports = {
   subCommand: 'playlist.create',
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      try {
         const { options, guild, user, member, channel } = interaction;

         const playlistName = options.getString('name').toLowerCase();

         let data = await Playlist.findOne({ userId: user.id });

         if (!data) {
            await Playlist.create({
               userId: user.id,
               guildId: guild.id,
               name: playlistName,
               privacy: true,
            });
         } else {
            if (data.name.includes(playlistName)) {
               return ErrorHandler(
                  interaction,
                  `Bạn đã có danh sách tên ${playlistName}`
               );
            }

            await Playlist.create({
               userId: user.id,
               guildId: guild.id,
               name: playlistName,
               privacy: true,
            });
         }

         return interaction.reply({
            embeds: [
               new EmbedBuilder()
                  .setColor('#2a9454')
                  .setDescription(
                     `✅ | Đã thêm danh sách **${playlistName.toUpperCase()}** được tạo bởi ${user}, sử dụng \`/playlist list\` để xem ID danh sách và \`/playlist privacy\` để chuyển quyền riêng tư`
                  ),
            ],
         });
      } catch (err) {
         console.log(err);
         return ErrorHandler(
            interaction,
            'Đã có lỗi xảy ra. Vui lòng thử lại sau!'
         );
      }
   },
};
