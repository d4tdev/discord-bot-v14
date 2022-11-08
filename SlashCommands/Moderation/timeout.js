const {
   SlashCommandBuilder,
   PermissionFlagsBits,
   ChatInputCommandInteraction,
   EmbedBuilder,
} = require('discord.js');
const InfractionsDB = require('../../Schema/Infractions');
const ms = require('ms');

module.exports = {
   category: 'Moderation',
   data: new SlashCommandBuilder()
      .setName('timeout')
      .setDescription('Timeouts a member')
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .setDMPermission(false)
      .addUserOption(options =>
         options
            .setName('target')
            .setDescription('Select the member to timeout')
            .setRequired(true)
      )
      .addStringOption(options =>
         options
            .setName('duration')
            .setDescription('Select the duration of the timeout (1m, 1h, 1d')
            .setRequired(true)
      )
      .addStringOption(options =>
         options
            .setName('reason')
            .setDescription('Provide a reason for the timeout')
            .setMaxLength(512)
      ),
   /**
    *
    * @param {ChatInputCommandInteraction} interaction
    */
   async execute(interaction) {
      const { options, guild, member } = interaction;

      const target = options.getMember('target');
      const duration = options.getString('duration');
      const reason = options.getString('reason') || 'No reason provided';

      let errorsArray = [];

      const errorsEmbed = new EmbedBuilder()
         .setAuthor({ name: 'Could not timeout member due to' })
         .setColor('Red');

      if (!target)
         return interaction.reply({
            embeds: [
               errorsEmbed.setDescription(
                  'Member has most likely left the guild.'
               ),
            ],
            ephemeral: true,
         });

      if (!ms(duration) || ms(duration) > ms('28d'))
         errorsArray.push('Time provided is invalid or over the 28d limit.');

      let timeError = false;
      await target
         .timeout(ms(duration), reason)
         .catch(() => (timeError = true));

      if (timeError)
         return interaction.reply({
            embeds: [
               errorsEmbed.setDescription(
                  'Could not timeout user due to an uncommon error. Cannot take negative values'
               ),
            ],
            ephemeral: true,
         });

      if (!target.manageable || !target.moderatable)
         errorsArray.push('Selected target is not moderatable by this bot.');

      if (member.roles.highest.position < target.roles.highest.position)
         errorsArray.push(
            'Selected member has a higher role position than you.'
         );

      if (errorsArray.length > 0) {
         errorsEmbed.setDescription(errorsArray.join('\n'));
         return interaction.reply({ embeds: [errorsEmbed], ephemeral: true });
      }

      target.timeout(ms(duration), reason).catch(err => {
         console.log('Error occurred in Timeout.js', err);
         return interaction.reply({
            embeds: [
               errorsEmbed.setDescription(
                  'An error occurred while trying to timeout the member.'
               ),
            ],
            ephemeral: true,
         });
      });

      const infractionsObject = {
         Issuer: member.id,
         IssuerTag: member.user.tag,
         Reason: reason,
      };

      let userData = await InfractionsDB.findOne({
         guildID: guild.id,
         userID: target.id,
      });

      if (!userData) {
         userData = await InfractionsDB.create({
            guildID: guild.id,
            userID: target.id,
            infractions: [infractionsObject],
         });
      } else {
         userData.infractions.push(infractionsObject);
         await userData.save();
      }

      const successEmbed = new EmbedBuilder()
         .setAuthor({ name: 'Timeout issues', iconUrl: guild.iconURL() })
         .setColor('Gold')
         .setDescription(
            [
               `${target} was issued a timeout for ${ms(ms(duration), {
                  long: true,
               })} ** by ${member}`,
               `bringing their infractions total to ${userData.infractions.length} points**.`,
               `\nReason: ${reason}`,
            ].join('\n')
         );

      return interaction.reply({ embeds: [successEmbed] });
   },
};
