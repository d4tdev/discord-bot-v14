const { model, Schema } = require('mongoose');

const VoiceLogSchema = new Schema({
   guildID: String,
   channelID: String,
});

module.exports = model('VoiceLog', VoiceLogSchema);
