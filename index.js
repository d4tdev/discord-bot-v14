const {
   Client,
   GatewayIntentBits,
   Partials,
   Collection,
} = require('discord.js');
const {
   Guilds,
   GuildMembers,
   GuildMessages,
   GuildVoiceStates,
   GuildPresences,
} = GatewayIntentBits;
const { User, Message, ThreadMember } = Partials;

const client = new Client({
   intents: [
      Guilds,
      GuildMembers,
      GuildMessages,
      GuildVoiceStates,
      GuildPresences,
   ],
   partials: [User, Message, ThreadMember],
});
require('dotenv').config();

const { loadEvents } = require('./Handlers/eventHandler');

const db = require('./Config/connect');

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

let spotifyOptions = {
   parallel: true,
   emitEventsAfterFetching: false,
};

client.distube = new DisTube(client, {
   leaveOnStop: false,
   leaveOnEmpty: true,
   emitNewSongOnly: true,
   emitAddSongWhenCreatingQueue: true,
   emitAddListWhenCreatingQueue: true,
   plugins: [new SpotifyPlugin(spotifyOptions)],
});

if (process.env.SPOTIFY_ENABLE) {
   spotifyOptions.api = {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
   };
}

module.exports = client;

client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();

loadEvents(client);
db.connectDB(process.env.MONGO_URI);

//anti crash
process.on('unhandledRejection', (reason, p) => {
   console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
   console.log(err, origin);
});

client.login(process.env.TOKEN);
