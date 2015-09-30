var xmpp        = require('./node_modules/simple-xmpp/lib/simple-xmpp.js');
var argv        = process.argv;
var mongoose    = require('mongoose');
// Models
var Chat        = require('./app/models/chat');

// Connect to the mongo database
mongoose.connect("localhost:27017");

var options = {
    jid: argv[2],
    password: argv[3],
    host: argv[4],
    nick: argv[2].substr(0, argv[2].indexOf('@')),
};

xmpp.on('online', function (data) {
    console.log('Yes, I\'m connected! ' + 'general@' + options.host + '/' + options.nick);
    xmpp.join('general@channels.robertsspaceindustries.com/' + options.nick);
});

xmpp.on('subscribe', function (from) {
    console.log(from);
});

xmpp.on('groupchat', function (conference, from, message, stamp) {
    console.log('%s says %s on %s', from, message, conference);
    // Record all the records in the DB.
    var chat = new Chat();
    chat.name = from;
    chat.message = message;
    chat.conference = conference;

    chat.save(function(err) {
        if (err) {
            console.log(err);
        }

        console.log('\t Chat record saved!');
    });
});

xmpp.on('error', function (err) {
    console.error(err);
});

xmpp.connect({
    jid: options.jid,
    password: options.password,
    host: options.host,
    port: 5222
});
