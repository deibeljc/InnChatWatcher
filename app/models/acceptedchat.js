// Database vars
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var AcceptedChatSchema = new Schema({
    date: { type: Date, default: Date.now },
    name: String,
    message: String,
    conference: String
});

module.exports = mongoose.model('AcceptedChat', AcceptedChatSchema);
