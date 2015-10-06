// Global vars
var express         = require('express');
var app             = express();
var exphbs          = require('express-handlebars');
var compression     = require('compression');

// Database things
var mongoose        = require('mongoose');
// Cache the database
var cacheOpts = {
    max:50,
    maxAge:1000*10
};

require('mongoose-cache').install(mongoose, cacheOpts);
// Models
var Chat            = require('./app/models/chat');
var Key             = require('./app/models/key');

// Connect to the mongo database
mongoose.connect("localhost:27017");

// Setup express
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
// Compress
var oneDay = 86400000;
app.use(compression());
app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

// This is a terrible hack and you should feel bad.
app.locals.newDate = "";

require('./routes/public')(app, mongoose, Chat, Key);
/**
 * Pull in the master routes.
 */
require('./routes/master')(app, mongoose, Chat, Key);

/**
 * Simple get dump of all the CIG employee chats.
 */
app.get('/api/chats/cig', function(req, res) {
    var getChats = Chat.
        find({
            'name': new RegExp("cig", "i")
        }).sort({ date: -1 });

    getChats.exec(function (err, chats) {
        if (err) {
            res.send(err);
        }
        res.json(chats);
    });
});

/**
 * This will get the previous 50 chats from a specific date.
 */
app.get('/api/chats/previous/:date', function(req, res) {
    var date = req.params.date;

    console.log(new Date(date) + new Date(date).toISOString());

    var startDate = new Date(date);
    startDate.setMinutes(startDate.getMinutes() - 60);

    // Get up to 50 chats before the current chat.
    var queryOtherChats = Chat.find().where('date').lt(new Date(date)).gt(startDate).sort({date: -1}).limit(50);

    queryOtherChats.exec(function(err, chats) {
        if (err) {
            res.send(err);
        }

        res.json(chats);
    });
});

app.get('/api/chats/vett/:id', function(req, res, next) {
    var id = req.params.id;

    Chat.findById(id, function(err, chat) {
        if (err) {
            return next(err);
        }

        chat.vetted = true;
        chat.save(function(err) {
            if (err) {
                return next(err);
            }

            res.status(200).send("Success");
        });
    });
});

app.get('/api/chats/unvett/:id', function(req, res, next) {
    var id = req.params.id;

    Chat.findById(id, function(err, chat) {
        if (err) {
            return next(err);
        }

        chat.vetted = false;
        chat.save(function(err) {
            if (err) {
                return next(err);
            }

            res.status(200).send("Success");
        });
    });
});

module.exports = app;

app.listen(80);