const loadMessages = async (client) => {
   const { loadFiles } = require('../Functions/fileLoader');
   const ascii = require('ascii-table');
   const table = new ascii().setHeading('Commands', 'Status');

   await client.messages.clear();

   let commandsArray = [];

   const Files = await loadFiles('Commands')

   Files.forEach(file => {
      const command = require(file);

      console.log(command.name)

      client.messages.set(command.name, command);
      commandsArray.push(command.name);

      table.addRow(command.name, '✅');
   });

   client.application.messages.set(commandsArray);

   return console.log(table.toString(), '\nLoaded Commands');
}

module.exports = { loadMessages };
