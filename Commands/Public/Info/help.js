const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { loadFiles } = require('../../../Functions/fileLoader');
const ErrorHandler = require('../../../Functions/errorHandler');
require('dotenv').config();

module.exports = {
   category: 'Info',
   data: new SlashCommandBuilder()
      .setName('help')
      .setDescription(
         'Xem danh sách các lệnh của bot. Không cần nhập options one_command !!!'
      )
      .addStringOption(option =>
         option
            .setName('one_command')
            .setDescription('Nhập tên lệnh.')
            .setRequired(false)
            .setAutocomplete(true)
      ),
   async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused();
      const choices = client.commands.map(c => c.data.name);
      const filtered = choices.filter(choice =>
         choice.startsWith(focusedValue)
      );
      await interaction.respond(
         filtered.map(choice => ({ name: choice, value: choice }))
      );
   },

   async execute(interaction, client) {
      try {
         const command = interaction.options.get('one_command');
         if (command) {
            getCommand(client, interaction);
         } else {
            getAllCommand(client, interaction);
         }
      } catch (error) {
         ErrorHandler(interaction, error);
      }
   },
};

const getAllCommand = (client, interaction) => {
   const embed = new EmbedBuilder()
      .setAuthor({
         name: `Danh sách các lệnh`,
         iconURL: client.user.displayAvatarURL(),
      })
      .setColor('2a9454')
      .setDescription(`> Tổng số lượng lệnh: ${client.commands.size}`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
         text: `Sử dụng /help + tên_lệnh để xem chi tiết!`,
         iconURL: `${interaction.member.user.displayAvatarURL()}`,
      });

   const categories = client.commands
      .map(c => c.category)
      .filter((c, i, a) => a.indexOf(c) === i);
   categories.forEach(category => {
      const commands = client.commands.filter(c => c.category === category);
      embed.addFields({
         name: `> ${category} (${commands.size}) `,
         value: commands.map(c => `\`\/${c.data.name}\``).join(' '),
      });
   });

   interaction.reply({ embeds: [embed] });
};

const getCommand = (client, interaction) => {
   const command = interaction.options.get('one_command');
   const commandData = client.commands.find(c => c.data.name === command.value);
   if (!commandData) {
      interaction.reply('Không tìm thấy command');
      return;
   }
   const embed = new EmbedBuilder()
      .setAuthor({
         name: `Thông tin chi tiết về lệnh`,
         iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(`Thông tin về command \`${command.value}\``)
      .setColor('2a9454')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
         {
            name: '> Tên command',
            value: commandData.data.name,
            inline: true,
         },
         {
            name: '> Danh mục',
            value: commandData.category,
            inline: false,
         },
         {
            name: '> Mô tả',
            value: commandData.data.description,
            inline: false,
         }
      )
      .setFooter({
         text: `Yêu cầu bởi ${interaction.member.user.tag}`,
         iconURL: `${interaction.member.user.displayAvatarURL()}`,
      });
   interaction.reply({ embeds: [embed] });
};
