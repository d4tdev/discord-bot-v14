const loadMessages = async (client) => {
   const { loadFiles } = require('../Functions/fileLoader');
   const ascii = require('ascii-table');
   const table = new ascii().setHeading('Commands', 'Status');

   await client.messages.clear();

   let commandsArray = [];

   const Files = await loadFiles('Commands')

   Files.forEach(file => {
      const command = require(file);

      client.messages.set(command.name, command);
      commandsArray.push(command);

      table.addRow(command.name, '✅');
   });

   // client.application.messages.set(commandsArray);

   return console.log(table.toString(), '\nLoaded Commands');
}

module.exports = { loadMessages };
