const { model, Schema } = require('mongoose');

const InfractionSchema = new Schema({
   guildID: {
      type: String,
      required: true,
   },
   userID: {
      type: String,
      required: true,
   },
   moderatorID: {
      type: String,
      required: true,
   },
   infractions: {
      type: Array,
   }
});

module.exports = model('Infraction', InfractionSchema);
