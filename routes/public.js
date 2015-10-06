module.exports = function(app, mongoose, Chat, Key) {

    /**
     * The main route. This does the magic! It will display all the chats
     * and then categorize it by day via a hack. This defaults it to 1000
     * chats
     */
    app.get('/', function (req, res) {
        var getChats = Chat.
            find({
                // Find the person here :D
                'name': new RegExp("cig", "i"),
                'vetted': true
            }).sort({date: -1}).limit(200).cache();

        getChats.exec(function (err, chats) {
            console.log(chats);
            if (err) {
                res.send(err);
            }
            res.render('index', {
                chats: chats,
                helpers: {
                    convertDateToLocal: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                    },
                    convertDateToDay: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString();
                    },
                    convertDateToTime: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleTimeString();
                    },
                    if_eq: function (a, opts) {
                        var newDate = new Date(a);
                        newDate = newDate.toLocaleDateString();

                        if (app.locals.newDate.localeCompare(newDate) == 0) { // Or === depending on your needs
                            console.log(app.locals.newDate + " ||| " + a);
                            return "";
                        } else {
                            console.log("Something " + app.locals.newDate + " ||| " + a);
                            return opts.fn(this);
                        }
                    },
                    setLocalsDate: function (options) {
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
                'name': new RegExp("cig", "i"),
                'vetted': true
            }).sort({date: -1}).limit(limit);

        getChats.exec(function (err, chats) {
            if (err) {
                res.send(err);
            }
            res.render('index', {
                chats: chats,
                helpers: {
                    convertDateToLocal: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                    },
                    convertDateToDay: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString();
                    },
                    convertDateToTime: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleTimeString();
                    },
                    if_eq: function (a, opts) {
                        var newDate = new Date(a);
                        newDate = newDate.toLocaleDateString();

                        if (app.locals.newDate.localeCompare(newDate) == 0) { // Or === depending on your needs
                            //console.log(app.locals.newDate + " ||| " + a);
                            return "";
                        } else {
                            //console.log("Something " + app.locals.newDate + " ||| " + a);
                            return opts.fn(this);
                        }
                    },
                    setLocalsDate: function (options) {
                        app.locals.newDate = options.fn(this);
                        return;
                    }
                }
            });
        });
    });

    app.get('/search/:search', function (req, res) {
        var search = req.params.search;

        var getChats = Chat.
            find({
                // Find the person here :D
                'name': new RegExp("cig", "i"),
                'vetted': true
            }).sort({date: -1}).limit(200);

        getChats.exec(function (err, chats) {
            if (err) {
                res.send(err);
            }
            res.render('index', {
                chats: chats,
                searched: search,
                helpers: {
                    convertDateToLocal: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                    },
                    convertDateToDay: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString();
                    },
                    convertDateToTime: function (options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleTimeString();
                    },
                    if_eq: function (a, opts) {
                        var newDate = new Date(a);
                        newDate = newDate.toLocaleDateString();

                        if (app.locals.newDate.localeCompare(newDate) == 0) { // Or === depending on your needs
                            console.log(app.locals.newDate + " ||| " + a);
                            return "";
                        } else {
                            console.log("Something " + app.locals.newDate + " ||| " + a);
                            return opts.fn(this);
                        }
                    },
                    setLocalsDate: function (options) {
                        app.locals.newDate = options.fn(this);
                        return;
                    }
                }
            });
        });
    });

}