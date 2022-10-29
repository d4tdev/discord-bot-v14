const {
   ChatInputCommandInteraction,
   SlashCommandBuilder,
   EmbedBuilder,
} = require('discord.js');
const axios = require('axios');
const Ascii = require('ascii-table');
const award = {
   G_ĐB: "Giải đặc biệt",
   G_1: "Giải nhất",
   G_2: "Giải nhì",
   G_3: "Giải ba",
   G_4: "Giải tư",
   G_5: "Giải năm",
   G_6: "Giải sáu",
   G_7: "Giải bảy",
};

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
      interaction.reply({ content: 'Đang tải kết quả...' });
      axios.get('https://api-xsmb-today.herokuapp.com/v1').then(res => {
         const data = res.data;

         let arrTimesNames = Object.keys(data.objTimesNames).map((key) => ({
            time: key,
            name: data.objTimesNames[key],
         }));

         const table = new Ascii(`Kết quả XSMB ngày: ${data.time}`);
         table.setBorder('|', '-', '+', '+');
         table.setHeading('Giải', 'Kết quả');
         
         arrTimesNames.forEach((item) => {
            table.addRow(award[item.time], item.name);
         });

         table.setAlign(0, Ascii.CENTER);
         table.setAlign(1, Ascii.CENTER);

         const embed = new EmbedBuilder()
            .setAuthor({
               name: 'Kết quả xổ số miền Bắc host',
               iconURL: 'https://image.vietstock.vn/2022/01/07/220107_XS_1.jpg',
            })
            .setColor('#2a9454')
            .setDescription(`\`\`\`css\n${table.toString()}\`\`\``)
            .setFooter({
               text: 'Powered by d4rtj#8572',
            });
         interaction.editReply({ content: "", embeds: [embed] });
      });
   },
};

// function formatArray(arr) {
//    return arr.map((item, index) => {
//       return `${item}`;
//    });
// }
