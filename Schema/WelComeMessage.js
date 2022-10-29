const { model, Schema } = require('mongoose');

let welcomeSchema = new Schema({
   Guild: String,
   Channel: String,
   Msg: String,
   Image: String,
});

module.exports = model('Welcome', welcomeSchema);
