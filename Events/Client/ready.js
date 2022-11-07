const { ActivityType } = require('discord.js');

const { loadCommands } = require('../../Handlers/commandHandler');

module.exports = {
   name: 'ready',
   once: true,
   async execute(client) {
      await loadCommands(client);
      console.log(`${client.user.tag} is ready!`);
      const statuses = [
         { name: 'dd4tj#8572 🔥', type: ActivityType.Listening },
         { name: `by ${client.guilds.cache.size} servers 📺`, type: ActivityType.Watching },
         { name: `by ${client.users.cache.size} users 👨‍💻`, type: ActivityType.Watching },
         {
            name: `by ${client.channels.cache.size} channels 🎞`,
            type: ActivityType.Watching,
         },
         { name: 'by Slash Commands [/]', type: ActivityType.Playing },
         { name: ' /help ⚙️', type: ActivityType.Listening },
      ];

      await client.user.setPresence({ activities: statuses[0], status: 'online' });
      let index = 1;
      setInterval(async () => {
         if (index > 5) index = 0;

         await client.user.setActivity(statuses[index]);
         index++;
      }, 3500);
   },
};
