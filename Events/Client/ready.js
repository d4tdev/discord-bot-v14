const { ActivityType } = require('discord.js');

const { loadCommands } = require('../../Handlers/commandHandler');

module.exports = {
   name: 'ready',
   once: true,
   async execute(client) {
      await loadCommands(client);
      console.log(`${client.user.tag} is ready!`);
      const statuses = [
         {
            name: `by ${client.guilds.cache.size} servers 📺`,
            type: ActivityType.Watching,
         },
         {
            name: `by ${client.users.cache.size} users 👨‍💻`,
            type: ActivityType.Watching,
         },
         {
            name: `by ${client.channels.cache.size} channels 🎞`,
            type: ActivityType.Watching,
         },
         { name: ` /help ⚙️`, type: ActivityType.Listening },
         // { name: `${client.user.username} 🤖`, type: ActivityType.Watching },
         { name: ` /help ⚙️`, type: ActivityType.Listening },

         { name: 'dd4tj#8572 🔥', type: ActivityType.Listening },
         { name: 'by Slash Commands [/]', type: ActivityType.Playing },
      ];

      client.user.setPresence({
         activities: [{ name: 'dd4tj#8572 🔥', type: ActivityType.Listening }],
         status: 'online',
      });
      let index = 0;
      setInterval(() => {
         if (index >= statuses.length ) index = 0;
         
         client.user.setActivity(statuses[index]);
         index++;
      }, 3500);
   },
};
