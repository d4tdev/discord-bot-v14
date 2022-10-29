const {
   ChatInputCommandInteraction,
   SlashCommandBuilder,
   EmbedBuilder,
   PermissionFlagsBits,
} = require('discord.js');

const welcomeSchema = require('../../../Schema/WelComeMessage');
const leaveSchema = require('../../../Schema/LeaveMessage');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('welcomer')
      .setDescription('set a welcome/leave message for your server')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand(options =>
         options
            .setName('welcome-set')
            .setDescription('Set a welcome message')
            .addChannelOption(opt =>
               opt
                  .setName('channel')
                  .setDescription('Set the channel')
                  .setRequired(true)
            )
            .addStringOption(opt =>
               opt
                  .setName('message')
                  .setDescription('Set a custom message for your welcomer')
            )
            .addAttachmentOption(opt =>
               opt
                  .setName('image')
                  .setDescription('Set an custom welcome image')
            )
      )
      .addSubcommand(options =>
         options
            .setName('leave-set')
            .setDescription('Set a leave message')
            .addChannelOption(opt =>
               opt
                  .setName('channel')
                  .setDescription('Set the channel')
                  .setRequired(true)
            )
            .addStringOption(opt =>
               opt
                  .setName('message')
                  .setDescription('Set a custom message for your leave messagw')
            )
            .addAttachmentOption(opt =>
               opt.setName('image').setDescription('Set an custom leave image')
            )
      )
      .addSubcommand(options =>
         options
            .setName('remove')
            .setDescription('Remove your welcome message')
            .addStringOption(opt =>
               opt
                  .setName('choices')
                  .setDescription('Choose which one you want to remove')
                  .addChoices(
                     {
                        name: 'Welcome Message',
                        value: 'wlc',
                     },
                     {
                        name: 'Leave Message',
                        value: 'lve',
                     }
                  )
            )
      ),
   /**
    * @param {ChatInputCommandInteraction} interaction
    */
   async execute(interaction, client) {
      const { options, member } = interaction;

      const sub = options.getSubcommand();

      switch (sub) {
         case 'welcome-set':
            {
               const welcomeCH = options.getChannel('channel');
               const welcomeMsg = options.getString('message') || ' ';
               const welcomeImage =
                  options.getAttachment('image') ||
                  'https://cdn.discordapp.com/attachments/842765315230138383/1035625788898287717/Altos_Odyssey_lands_on_Android_for_free_next_week___Engadget.gif';

               welcomeSchema.findOne(
                  {
                     Guild: interaction.guild.id,
                  },
                  async (err, data) => {
                     if (!data) {
                        welcomeSchema.create({
                           Guild: interaction.guild.id,
                           Channel: welcomeCH.id,
                           Msg: welcomeMsg,
                           Image: welcomeImage.url,
                        });

                        console.log(welcomeImage.url);

                        interaction.reply({
                           embeds: [
                              new EmbedBuilder()
                                 .setTitle('Welcomer has been Set Successfully')
                                 .setDescription(
                                    `Welcome channels set to:\n${welcomeCH}\n\nCustom Messages:\n${welcomeMsg}\n\nCustom Image set to:`
                                 )
                                 .setImage(welcomeImage.url)
                                 .setColor('#5FD7FF'),
                           ],
                           ephemeral: true,
                        });
                     } else {
                        if (data) {
                           data.Guild = interaction.guild.id;
                           data.Channel = welcomeCH.id;
                           data.Msg = welcomeMsg;
                           data.Image = welcomeImage.url;
                           data.save();
                        }

                        console.log(welcomeImage.url);

                        interaction.reply({
                           embeds: [
                              new EmbedBuilder()
                                 .setTitle(
                                    'Welcomer has been Updated Successfully'
                                 )
                                 .setDescription(
                                    `Welcome channels Updated to :\n${welcomeCH}\n\nCustom Messages Updated to :\n${welcomeMsg}\n\nCustom Image Updated to:`
                                 )
                                 .setImage(welcomeImage.url)
                                 .setColor('#5FD7FF'),
                           ],
                           ephemeral: true,
                        });
                     }
                     if (err) {
                        console.log(err);

                        return interaction.reply({
                           embeds: [
                              new EmbedBuilder()
                                 .setDescription(`An Errors Has Occurred!`)
                                 .setColor('#5FD7FF'),
                           ],
                           ephemeral: true,
                        });
                     }
                  }
               );
            }
            break;
         case 'leave-set':
            {
               const leaveCH = options.getChannel('channel');
               const leaveMsg = options.getString('message') || ' ';
               const leaveImage =
                  options.getAttachment('image') ||
                  'https://cdn.discordapp.com/attachments/842765315230138383/1035625788898287717/Altos_Odyssey_lands_on_Android_for_free_next_week___Engadget.gif';

               leaveSchema.findOne(
                  {
                     Guild: interaction.guild.id,
                  },
                  async (err, data) => {
                     if (!data) {
                        leaveSchema.create({
                           Guild: interaction.guild.id,
                           Channel: leaveCH.id,
                           Msg: leaveMsg,
                           Image: leaveImage.url,
                        });

                        console.log(leaveImage.url);

                        interaction.reply({
                           embeds: [
                              new EmbedBuilder()
                                 .setTitle(
                                    'Leave Message has been Set Successfully'
                                 )
                                 .setDescription(
                                    `Leave channels set to:\n${leaveCH}\n\nCustom Messages:\n${leaveMsg}\n\nCustom Image set to:`
                                 )
                                 .setImage(leaveImage.url)
                                 .setColor('#5FD7FF'),
                           ],
                           ephemeral: true,
                        });
                     } else {
                        if (data) {
                           data.Guild = interaction.guild.id;
                           data.Channel = leaveCH.id;
                           data.Msg = leaveMsg;
                           data.Image = leaveImage.url;
                           data.save();
                        }

                        console.log(leaveImage.url);

                        interaction.reply({
                           embeds: [
                              new EmbedBuilder()
                                 .setTitle(
                                    'Leave Message has been Updated Successfully'
                                 )
                                 .setDescription(
                                    `Leave channels Updated to :\n${leaveCH}\n\nCustom Messages Updated to :\n${leaveMsg}\n\nCustom Image Updated to:`
                                 )
                                 .setImage(leaveImage.url)
                                 .setColor('#5FD7FF'),
                           ],
                           ephemeral: true,
                        });
                     }
                     if (err) {
                        console.log(err);

                        return interaction.reply({
                           embeds: [
                              new EmbedBuilder()
                                 .setDescription(`An Errors Has Occurred!`)
                                 .setColor('#5FD7FF'),
                           ],
                           ephemeral: true,
                        });
                     }
                  }
               );
            }
            break;

         case 'remove':
            {
               const rem = options.getString('choices');

               switch (rem) {
                  case 'wlc':
                     welcomeSchema.findOne(
                        {
                           Guild: interaction.guild.id,
                        },
                        async (err, data) => {
                           if (data) {
                              data.delete();
                              interaction.reply({
                                 embeds: [
                                    new EmbedBuilder()
                                       .setTitle(
                                          'Successfully removed the welcomer'
                                       )
                                       .setColor('#5FD7FF'),
                                 ],
                                 ephemeral: true,
                              });
                           } else {
                              interaction.reply({
                                 embeds: [
                                    new EmbedBuilder()
                                       .setTitle('Failed to remove welcomer')
                                       .setDescription(
                                          'Your server have not been registered/ you have never used the welcomer'
                                       )
                                       .setColor('#FF000A'),
                                 ],
                                 ephemeral: true,
                              });
                           }
                           if (err) {
                              console.log(err);

                              return interaction.reply({
                                 embeds: [
                                    new EmbedBuilder()
                                       .setDescription(
                                          `An Errors Has Occurred!`
                                       )
                                       .setColor('#5FD7FF'),
                                 ],
                                 ephemeral: true,
                              });
                           }
                        }
                     );
                     break;
                  case 'lve':
                     leaveSchema.findOne(
                        {
                           Guild: interaction.guild.id,
                        },
                        async (err, data) => {
                           if (data) {
                              data.delete();
                              interaction.reply({
                                 embeds: [
                                    new EmbedBuilder()
                                       .setTitle(
                                          'Successfully removed the leave message'
                                       )
                                       .setColor('#5FD7FF'),
                                 ],
                                 ephemeral: true,
                              });
                           } else {
                              interaction.reply({
                                 embeds: [
                                    new EmbedBuilder()
                                       .setTitle('Failed to remove welcomer')
                                       .setDescription(
                                          'Your server have not been registered/ you have never used the leave message'
                                       )
                                       .setColor('#FF000A'),
                                 ],
                                 ephemeral: true,
                              });
                           }
                           if (err) {
                              console.log(err);

                              return interaction.reply({
                                 embeds: [
                                    new EmbedBuilder()
                                       .setDescription(
                                          `An Errors Has Occurred!`
                                       )
                                       .setColor('#5FD7FF'),
                                 ],
                                 ephemeral: true,
                              });
                           }
                        }
                     );

                     break;
               }
            }
            break;
      }
   },
};
