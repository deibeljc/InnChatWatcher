/**
 * This is all the routes that regard to the master view of all the chat data.
 * @param app
 * @param mongoose
 * @param Chat
 * @param Key
 */
module.exports = function(app, mongoose, Chat, Key) {

    app.get('/master/create/:key', function(req, res) {
        key = req.params.key;

        var newKey = new Key();
        newKey.key = key;

        newKey.save(function(err) {
            if (err) {
                console.log(err);
            }

            console.log("Registered master key");
        });

    });

    /**
     * The *key* route for Erris to still be able to view it.
     */
    app.get('/master/:key', function (req, res) {
        var key = req.params.key;

        var getChats = Chat.
            find({
                // Find the person here :D
                'name': new RegExp("cig", "i")
            }).sort({date: -1}).limit(200);

        console.log(key);

        getChats.exec(function (err, chats) {
            if (err) {
                res.send(err);
            }

            Key.findOne({
                'key': key
            }).exec(function (err, result) {
                if (result == null) {
                    res.send("You don't have access!");
                } else {
                    res.render('index', {
                        chats: chats,
                        key: key,
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
                }
            });
        });
    });

    /**
     * The main route. This does the magic! It will display all the chats
     * and then categorize it by day via a hack.
     * This allows you to set the chat limit
     */
    app.get('/master/:key/:limit', function (req, res) {
        var limit = req.params.limit;
        var key   = req.params.key;

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
                key: key,
                helpers: {
                    convertDateToLocal: function(options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                    },
                    convertDateToDay: function(options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString();
                    },
                    convertDateToTime: function(options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleTimeString();
                    },
                    if_eq: function(a, opts) {
                        var newDate = new Date(a);
                        newDate = newDate.toLocaleDateString();

                        if(app.locals.newDate.localeCompare(newDate) == 0) { // Or === depending on your needs
                            //console.log(app.locals.newDate + " ||| " + a);
                            return "";
                        } else {
                            //console.log("Something " + app.locals.newDate + " ||| " + a);
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
     * Search will still function for erris
     */
    app.get('/search/master/:key/:search', function (req, res) {
        var search = req.params.search;
        var key    = req.params.key;

        var getChats = Chat.
            find({
                // Find the person here :D
                'name': new RegExp(search, "i")
            }).sort({ date: -1 }).limit(200);

        console.log(search);
        getChats.exec(function (err, chats) {
            if (err) {
                res.send(err);
            }
            res.render('index', {
                chats: chats,
                key: key,
                searched: search,
                helpers: {
                    convertDateToLocal: function(options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
                    },
                    convertDateToDay: function(options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleDateString();
                    },
                    convertDateToTime: function(options) {
                        var newDate = new Date(options.fn(this));
                        return newDate.toLocaleTimeString();
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


};