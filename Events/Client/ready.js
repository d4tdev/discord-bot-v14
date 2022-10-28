const { loadCommands } = require('../../Handlers/commandHandler');

module.exports = {
   name: 'ready',
   once: true,
   async execute(client) {
      await loadCommands(client);
      console.log('The client is ready!');
      const statuses = [
         'with d4rtj#8572',
         `with ${client.guilds.cache.size} servers`,
         `with ${client.users.cache.size} users`,
         `with ${client.channels.cache.size} channels`,
         'by Slash Commands [/]',
      ];

      let index = 0;
      setInterval(() => {
         if (index === statuses.length) index = 0;

         client.user.setActivity(statuses[index]);
         index++;
      }, 2000);
   },
};
