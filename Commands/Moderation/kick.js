const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Kicks a member')
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .setDMPermission(false)
      .addUserOption(options =>
         options
            .setName('target')
            .setDescription('Select the member to kick')
            .setRequired(true)
      )
      .addStringOption(options =>
         options
            .setName('reason')
            .setDescription('Provide a reason for the kick')
            .setMaxLength(512)
      ),
   /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    *
    */
   async execute(interaction, client) {
      const member = interaction.options.getMember('target');
      const reason =
         interaction.options.getString('reason') || 'No reason provided';

      const embed = new EmbedBuilder().setColor('Navy');

      if (
         member.roles.highest.position >
         interaction.member.roles.highest.position
      ) {
         embed.setDescription(
            'You cannot kick this member. They have a higher role than you.'
         );
         return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      if (member.id === interaction.user.id) {
         embed.setDescription('You cannot kick yourself.');
         return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      if (member.id === client.user.id) {
         embed.setDescription('You cannot kick me.');
         return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      if (!member.kickable) {
         embed.setDescription('I cannot kick this member.');
         return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      await member.kick(reason)

      embed.setDescription(`Kicked ${member.user.tag} for ${reason}`);

      interaction.reply({
         embeds: [embed]
      })
   },
};
