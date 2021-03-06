// Database vars
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var ChatSchema = new Schema({
    date: { type: Date, default: Date.now },
    name: String,
    message: String,
    conference: String,
    vetted: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Chat', ChatSchema);
