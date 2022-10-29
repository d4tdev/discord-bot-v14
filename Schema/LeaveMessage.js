const { model, Schema } = require('mongoose');

let leaveSchema = new Schema({
   Guild: String,
   Channel: String,
   Msg: String,
   Image: String,
});

module.exports = model('Leave', leaveSchema);
