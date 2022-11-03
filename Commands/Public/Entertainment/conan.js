const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const sex = {
   Male: 'Nam',
   Female: 'Nữ',
};

module.exports = {
   category: 'Information',
   data: new SlashCommandBuilder()
      .setName('conan')
      .setDescription('Tìm kiếm thông tin nhân vật trong anime Conan!')
      .addStringOption(option =>
         option
            .setName('tên_nhân_vật')
            .setDescription('Tên nhân vật')
            .setRequired(true)
            .setAutocomplete(true)
      ),
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    *
    */
   async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused();
      axios.get('https://api-conan.herokuapp.com/api').then(async res => {
         const data = res.data.characters;

         const names = data.map(character => character.name);

         const filteredNames = names.filter(name =>
            name.toLowerCase().startsWith(focusedValue.toLowerCase())
         );

         // hiện thị 10 kết quả
         const slicedNames = filteredNames.slice(0, 25);

         await interaction.respond(
            slicedNames.map(name => ({ name, value: name }))
         );
      });
   },
   async execute(interaction, client) {
      const character = interaction.options.getString('tên_nhân_vật');
      axios
         .get(`https://api-conan.herokuapp.com/api/character/${character}`)
         .then(async res => {
            const data = res.data;
            console.log(data)

            const resAll = await axios.get('https://api-conan.herokuapp.com/api')
            const dataAll = res.data.characters
            const embed = new EmbedBuilder()
               .setAuthor({
                  name: 'Conan Detective',
                  url: 'https://cdnimg.vietnamplus.vn/t460/Uploaded/mzdiq/2016_08_07/conan2.PNG',
               })
               .addFields([
                  {
                     name: 'Tên tiếng Nhật',
                     value: data.japanese_name ? data.japanese_name : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Tên tiếng Anh',
                     value: data.english_name ? data.english_name : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Trạng thái',
                     value: data.status ? data.status : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Giới tính',
                     value: data.gender ? sex[data.gender] : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Tuổi',
                     value: data.age ? data.age : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Sinh nhật',
                     value: data.date_of_birth ? data.date_of_birth : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Chiều cao',
                     value: data.height ? data.height : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Cân nặng',
                     value: data.weight ? data.weight : 'Không xác định',
                     inline: true,
                  },
                  {
                     name: 'Mối quan hệ',
                     value: data.relatives ? data.relatives : 'Không xác định',
                  },
                  {
                     name: 'Nghề nghiệp',
                     value: data.occupation? data.occupation : 'Không xác định',
                  },
               ])
               .setImage(data.image)
               .setColor('#2a9454');

            await interaction.reply({ embeds: [embed] });
         });
   },
};
