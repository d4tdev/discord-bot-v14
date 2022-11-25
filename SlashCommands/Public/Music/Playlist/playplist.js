const { SlashCommandBuilder } = require('discord.js');

module.exports = {
   category: 'Music',
   data: new SlashCommandBuilder()
      .setName('playlist')
      .setDescription('Các lựa chọn về danh sách phát <create | add | privacy | play | list | remove | delete | info>')
      .addSubcommand(options =>
         options
            .setName('create')
            .setDescription('Tạo một danh sách phát mới.')
            .addStringOption(option =>
               option
                  .setName('name')
                  .setDescription(
                     'Tên của danh sách phát (Sử dụng "1 từ" để tối ưu ).'
                  )
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('privacy')
            .setDescription('Thay đổi quyền riêng tư của danh sách phát.')
            .addStringOption(option =>
               option
                  .setName('playlist-id')
                  .setDescription('ID của danh sách phát.')
                  .setRequired(true)
            )
            .addStringOption(option =>
               option
                  .setName('options')
                  .setDescription('Quyền riêng tư của danh sách phát.')
                  .addChoices(
                     { name: 'Public', value: 'public' },
                     { name: 'Private', value: 'private' }
                  )
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('add')
            .setDescription('Thêm một bài hát vào danh sách phát.')
            .addStringOption(option =>
               option
                  .setName('playlist-id')
                  .setDescription('Id của danh sách phát.')
                  .setRequired(true)
            )
            .addStringOption(option =>
               option
                  .setName('song-name')
                  .setDescription('Tên hoặc URL của bài hát.')
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('remove')
            .setDescription('Xóa một bài hát khỏi danh sách phát.')
            .addStringOption(option =>
               option

                  .setName('playlist-id')
                  .setDescription('Id của danh sách phát.')
                  .setRequired(true)
            )
            .addIntegerOption(option =>
               option
                  .setName('song-position')
                  .setDescription('Vị trí của bài hát cần xóa.')
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('delete')
            .setDescription('Xóa một danh sách phát.')
            .addStringOption(option =>
               option
                  .setName('playlist-id')
                  .setDescription('Id của danh sách phát.')
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('list')
            .setDescription('Liệt kê danh sách phát của bạn.')
            .addStringOption(option =>
               option
                  .setName('options')
                  .setDescription('Lựa chọn của bạn.')
                  .addChoices(
                     { name: 'Public', value: 'public' },
                     { name: 'Private', value: 'private' }
                  )
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('info')
            .setDescription('Xem thông tin của một danh sách phát.')
            .addStringOption(option =>
               option
                  .setName('playlist-id')
                  .setDescription('Id của danh sách phát.')
                  .setRequired(true)
            )
      )
      .addSubcommand(options =>
         options
            .setName('play')
            .setDescription('Chơi một danh sách phát.')
            .addStringOption(option =>
               option

                  .setName('playlist-id')

                  .setDescription('Id của danh sách phát.')
                  .setRequired(true)
                  .setAutocomplete(true)
            )
      ),
};
