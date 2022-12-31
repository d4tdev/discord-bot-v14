const {model, Schema} = require('mongoose');

module.exports = model('playlist', new Schema({
   guildId: String,
   userId: String,
   name: String,
   songs: {
      url: [],
      name: []
   },
   privacy: Boolean,
}))
