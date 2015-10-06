// Database vars
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var KeySchema = new Schema({
    key: String
});

module.exports = mongoose.model('Key', KeySchema);
