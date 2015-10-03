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

app.get('/', function (req, res) {
    var getChats = Chat.
        find({
            // Find the person here :D
            'name': new RegExp("cig", "i")
        }).sort({ date: -1 });

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
                }
            }
        });
    });
});

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