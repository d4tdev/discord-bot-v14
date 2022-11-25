const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('queue')
      .setDescription('Các lựa chọn về danh sách phát hiện tại. (/queue <view | clear | remove>)')
      .addSubcommand(subcommand =>
         subcommand
            .setName('clear')
            .setDescription('Xóa danh sách phát hiện tại.')
      )
      .addSubcommand(subcommand =>
         subcommand
            .setName('remove')
            .setDescription('Xóa một bài hát khỏi danh sách phát hiện tại.')
            .addIntegerOption(option =>
               option
                  .setName('song-number')
                  .setDescription('Số thứ tự của bài hát trong danh sách phát.')
                  .setRequired(true)
            )
      )
      .addSubcommand(subcommand =>
         subcommand
            .setName('view')
            .setDescription('Xem danh sách phát hiện tại.')
      ),
};
