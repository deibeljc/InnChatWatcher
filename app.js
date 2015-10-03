var express = require('express');
var app = express();

var exphbs  = require('express-handlebars');

// Database things
var mongoose    = require('mongoose');
// Models
var Chat        = require('./app/models/chat');

// Connect to the mongo database
mongoose.connect("localhost:27017");

var exphbs  = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// This is a terrible hack and you should feel bad.
app.locals.newDate = "";

/**
 * The main route. This does the magic! It will display all the chats
 * and then categorize it by day via a hack. This defaults it to 1000
 * chats
 */
app.get('/', function (req, res) {
    var getChats = Chat.
        find({
            // Find the person here :D
            'name': new RegExp("cig", "i")
        }).sort({ date: -1 }).limit(1000);

    getChats.exec(function (err, chats) {
        if (err) {
            res.send(err);
        }
        res.render('index', {
            chats: chats,
            helpers: {
                convertDateToLocal: function(options) {
                    var newDate = new Date(options.fn(this));
                    return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                },
                convertDateToDay: function(options) {
                    var newDate = new Date(options.fn(this));
                    return newDate.toLocaleDateString();
                },
                if_eq: function(a, opts) {
                    var newDate = new Date(a);
                    newDate = newDate.toLocaleDateString();

                    if(app.locals.newDate.localeCompare(newDate) == 0) { // Or === depending on your needs
                        console.log(app.locals.newDate + " ||| " + a);
                        return "";
                    } else {
                        console.log("Something " + app.locals.newDate + " ||| " + a);
                        return opts.fn(this);
                    }
                },
                setLocalsDate: function(options) {
                    app.locals.newDate = options.fn(this);
                    return;
                }
            }
        });
    });
});

/**
 * The main route. This does the magic! It will display all the chats
 * and then categorize it by day via a hack.
 * This allows you to set the chat limit
 */
app.get('/:limit', function (req, res) {
    var limit = req.params.limit;

    // Set limit to default value if it isn't set
    if (limit == "") {
        limit = 1000;
    }

    var getChats = Chat.
        find({
            // Find the person here :D
            'name': new RegExp("cig", "i")
        }).sort({ date: -1 }).limit(limit);

    getChats.exec(function (err, chats) {
        if (err) {
            res.send(err);
        }
        res.render('index', {
            chats: chats,
            helpers: {
                convertDateToLocal: function(options) {
                    var newDate = new Date(options.fn(this));
                    return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                },
                convertDateToDay: function(options) {
                    var newDate = new Date(options.fn(this));
                    return newDate.toLocaleDateString();
                },
                if_eq: function(a, opts) {
                    var newDate = new Date(a);
                    newDate = newDate.toLocaleDateString();

                    if(app.locals.newDate.localeCompare(newDate) == 0) { // Or === depending on your needs
                        console.log(app.locals.newDate + " ||| " + a);
                        return "";
                    } else {
                        console.log("Something " + app.locals.newDate + " ||| " + a);
                        return opts.fn(this);
                    }
                },
                setLocalsDate: function(options) {
                    app.locals.newDate = options.fn(this);
                    return;
                }
            }
        });
    });
});

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



app.listen(3000);