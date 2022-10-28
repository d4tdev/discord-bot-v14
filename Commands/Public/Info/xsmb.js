const {
   ChatInputCommandInteraction,
   SlashCommandBuilder,
   EmbedBuilder,
} = require('discord.js');
const axios = require('axios');
const Ascii = require('ascii-table');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('xsmb')
      .setDescription('Hiển thị kết quả số miền Bắc'),
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
   execute(interaction, client) {
      axios.get('https://api-xsmb-today.herokuapp.com/v1').then(res => {
         const data = res.data;

         const table = new Ascii(`Kết quả XSMB ngày: ${data.time}`);
         table.setBorder('|', '-', '+', '+');
         table.setHeading('Giải', 'Kết quả');
         table.addRow('Giải Đặc Biệt', data.objTimesNames.G_ĐB);
         table.addRow('Giải nhất', data.objTimesNames.G_1);
         table.addRow('Giải nhì', formatArray(data.objTimesNames.G_2));
         table.addRow('Giải ba', formatArray(data.objTimesNames.G_3));
         table.addRow('Giải tư', formatArray(data.objTimesNames.G_4));
         table.addRow('Giải năm', formatArray(data.objTimesNames.G_5));
         table.addRow('Giải sáu', formatArray(data.objTimesNames.G_6));
         table.addRow('Giải bảy', formatArray(data.objTimesNames.G_7));

         table.setAlign(0, Ascii.CENTER);
         table.setAlign(1, Ascii.CENTER);

         const embed = new EmbedBuilder()
            .setAuthor({
               name: 'Kết quả xổ số miền Bắc',
               iconURL: 'https://image.vietstock.vn/2022/01/07/220107_XS_1.jpg',
            })
            .setColor('#2a9454')
            .setDescription(`\`\`\`css\n${table.toString()}\`\`\``)
            .setFooter({
               text: 'Powered by d4rtj#8572',
            });
         interaction.reply({ embeds: [embed] });
      });
   },
};

function formatArray(arr) {
   return arr.map((item, index) => {
      return `${item}`;
   });
}
