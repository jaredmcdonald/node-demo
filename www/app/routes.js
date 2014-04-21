module.exports = function(app, passport, manifest) {

    //var apiUrl = "http://local.adam.com:3000";
    var apiUrl = "http://api.nyc.gallery";

    // tests
    app.get('/comingsoon', function(req, res) {
        res.render('comingsoon.ejs', {});
    });

    // tests
    //app.get('/tests', function(req, res) {
        //if(req.host == "nyc.gallery") res.redirect('/comingsoon');
    //});

	// show the home page
	app.get('/', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var artEvent = require(__dirname + '/controllers/gets.js'),
            artists = require(__dirname + '/controllers/artists.js');
        artEvent.getRandomArtEvent(req, res, function(randomArtEvent) {
            artists.getData(req, res, 5, function(artists) {
                artEvent.getRecentArtEvents(req, res, 5, function(artEvents) {
                    res.render('index.ejs', {
                        env : global.env,
                        pageTitle : "NYCG",
                        bodyClass : "home",
                        msgSuccess: req.flash('msgSuccess'),
                        artists : artists,
                        randomArtEvent : randomArtEvent,
                        artEvents: artEvents,
                        user : (req.isAuthenticated()) ? req.user : false,
                        isLoggedIn: req.isAuthenticated()
                    });
                });
            });
        });
	});

    // show the events page
    app.get('/events', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var artEvent = require(__dirname + '/controllers/gets.js');
        artEvent.getRandomArtEvent(req, res, function(randomArtEvent) {
            artEvent.getRecentArtEvents(req, res, 5, function(artEvents) {
                artEvent.getRecentCalls(req, res, 5, function(artCalls) {
                    res.render('events.ejs', {
                        env : global.env,
                        pageTitle : "NYCG | Events",
                        bodyClass : "events",
                        rss : {
                            title: "Events",
                            path: "/event"
                        },
                        artEvents: artEvents,
                        artCalls: artCalls,
                        randomArtEvent : randomArtEvent,
                        infiniteScroll : '{ url : "' + apiUrl + '", ns : "events", selector: ".nycg-listing", tmpl: "#tmpl-list", limit : 4, isLoading: false, status : true }', // pass the options
                        user : (req.isAuthenticated()) ? req.user : false,
                        isLoggedIn: req.isAuthenticated()
                    });
                });
            });
        });
    });

    // show the events detail page
    app.get('/event-detail/:id', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var artEvent = require(__dirname + '/controllers/gets.js');
        artEvent.getRecentArtEvents(req, res, 5, function(artEvents) {
            artEvent.getArtEventById(req, res, req.params.id, function(artEv) {
                artEvent.getUserById(req, res, artEv.uid, function(eventUser) {
                    res.render('event-detail.ejs', {
                        env : global.env,
                        pageTitle : "NYCG | Event Detail | " + artEvent.name,
                        pageHeader : artEv.name,
                        shareThis : true,
                        artEvents: artEvents,
                        artEvent: artEv,
                        eventUser: eventUser,
                        bodyClass : "event-detail nycg-detail",
                        user : (req.isAuthenticated()) ? req.user : false,
                        isLoggedIn: req.isAuthenticated()
                    });
                });
            });
        });
    });

    // show the profile page
    app.get('/profile/:username', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var profile = require(__dirname + '/controllers/profile.js');
        profile.getProfile(req, res, function(profile) {
            if(profile.accountType == "artist") {
                var art = require(__dirname + '/controllers/gets.js');
                art.getArt(req, res, profile._id, 8, function(art) {
                    res.render('artist-detail.ejs', {
                        env : global.env,
                        pageTitle : "NYCG | " + profile.displayName,
                        pageHeader : profile.displayName,
                        shareThis : true,
                        artist : profile,
                        art : art,
                        bodyClass : "artist-detail nycg-detail",
                        user : (req.isAuthenticated()) ? req.user : false,
                        isLoggedIn: req.isAuthenticated()
                    });
                });
            } else {
                var artEvent = require(__dirname + '/controllers/gets.js');
                artEvent.getPhotos(req, res, profile._id, 8, function(photos) {
                    artEvent.getArtEvents(req, res, profile._id, 8, function(artEvents) {
                        res.render('venue-detail.ejs', {
                            env : global.env,
                            pageTitle : "NYCG | " + profile.displayName,
                            pageHeader : profile.displayName,
                            shareThis : true,
                            venue : profile,
                            artEvents: artEvents,
                            photos : photos,
                            bodyClass : "nycg-detail venue-detail",
                            user : (req.isAuthenticated()) ? req.user : false,
                            isLoggedIn: req.isAuthenticated()
                        });
                    });
                });
            }
        });
    });

    // show the admin
    app.get('/admin', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var displayName = "Anonymous";
        if(typeof req.user.displayName !== "undefined")
            displayName = req.user.displayName;
        if(req.user.accountType == "") {
            res.render('register-finish.ejs', {
                env : global.env,
                pageTitle : "NYCG | Finish Registration",
                pageHeader : "Finish Registration",
                bodyClass : "registration registration-finish",
                user : req.user,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr')
            });
        } else if(req.user.accountType == "artist") {
            var profile = require(__dirname + '/controllers/profile.js'),
                art = require(__dirname + '/controllers/art.js');
            profile.getData(req, res, function(profile) {
                art.getData(req, res, 8, function(art) {
                    res.render('artist-detail-admin.ejs', {
                        env : global.env,
                        pageTitle : "NYCG | " + displayName,
                        pageHeader : displayName,
                        bodyClass : "nycg-detail artist-detail nycg-detail-admin",
                        user : profile,
                        art : art,
                        msgSuccess: req.flash('msgSuccess'),
                        msgErr: req.flash('msgErr'),
                        isLoggedIn: true
                    });
                });
            });
        } else if(req.user.accountType == "venue") {
            var profile = require(__dirname + '/controllers/profile.js'),
                photo = require(__dirname + '/controllers/photo.js'),
                artEvent = require(__dirname + '/controllers/event.js');
            profile.getData(req, res, function(profile) {
                photo.getData(req, res, 8, function(photo) {
                    artEvent.getData(req, res, 8, function(artEvent) {
                        res.render('venue-detail-admin.ejs', {
                            env : global.env,
                            pageTitle : "NYCG | " + displayName,
                            pageHeader : displayName,
                            bodyClass : "nycg-detail venue-detail nycg-detail-admin",
                            user : profile,
                            photo : photo,
                            artEvent : artEvent,
                            msgSuccess: req.flash('msgSuccess'),
                            msgErr: req.flash('msgErr'),
                            isLoggedIn: true
                        });
                    });
                });
            });
        } else {
            res.redirect("/login-register");
            msgErr: "Sorry, there was a problem."
        }
    });

    // process the choice
    app.post('/admin', function(req, res){
        var admin = require(__dirname + '/controllers/admin.js');
        admin.finishReg(req, res, passport);
    });

    // show the artists page
    app.get('/artists', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var artists = require(__dirname + '/controllers/artists.js');
        artists.getData(req, res, 8, function(artists) {
            res.render('artists.ejs', {
                env : global.env,
                pageTitle : "NYCG | Artists",
                bodyClass : "artists",
                rss: {
                    title: "Artists",
                    path: "/artist"
                },
                artists : artists,
                infiniteScroll : '{ url : "' + apiUrl + '", ns : "artists", selector: ".nycg-listing", tmpl: "#tmpl-list", limit : 4, isLoading: false, status : true }', // pass the options
                user : (req.isAuthenticated()) ? req.user : false,
                isLoggedIn: req.isAuthenticated()
            });
        });
    });

    // show the artist profile edit page
    app.get('/artist-detail-edit', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var profile = require(__dirname + '/controllers/profile.js');
        profile.getData(req, res, function(profile) {
            res.render('artist-detail-edit.ejs', {
                env : global.env,
                pageTitle : "NYCG | Edit Profile",
                pageHeader : "Edit Profile",
                bodyClass : "artist-detail-edit",
                user : profile,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr'),
                isLoggedIn: true
            });
        });
    });

    // process the artist profile page
    app.post('/artist-detail-edit', function(req, res){
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var profile = require(__dirname + '/controllers/profile.js');
        profile.postData(req, res, passport, function(){ // success
            req.flash('msgSuccess', "Profile updated!");
            res.redirect("/artist-detail-edit");
        },
        function(errMsg){ //error
            req.flash('msgErr', errMsg);
            res.redirect("/artist-detail-edit");
        });
    });

    // show the artist detail image add page
    app.get('/artist-detail-image-add', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.render('artist-detail-image-add.ejs', {
            env : global.env,
            pageTitle : "NYCG | Upload New Images",
            pageHeader : "Upload New Images",
            bodyClass : "artist-detail-image-add",
            user : req.user,
            msgSuccess: req.flash('msgSuccess'),
            msgErr: req.flash('msgErr'),
            isLoggedIn: true
        });
    });

    // process the artist image add page
    app.post('/artist-detail-image-add', isLoggedIn, function(req, res){
        var art = require(__dirname + '/controllers/art.js');
        art.postData(req, res, "/artist-detail-image-add", function(art){ // success
                req.flash('msgSuccess', "'" + art.title + "'" + " added!");
                res.redirect("artist-detail-image-edit/" + art._id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/artist-detail-image-add");
            });
    });

    // show the artist detail image edit page
    app.get('/artist-detail-image-edit/:id', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var art = require(__dirname + '/controllers/art.js');
        art.getDataById(req, res, function(art) {
            res.render('artist-detail-image-edit.ejs', {
                env : global.env,
                pageTitle : "NYCG | Edit Single Work",
                pageHeader : "Edit Single Work",
                bodyClass : "artist-detail-image-edit",
                art : art,
                user : req.user,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr'),
                isLoggedIn: true
            });
        });
    });

    // process the artist detail image edit
    app.post('/artist-detail-image-edit/:id', isLoggedIn, function(req, res){
        var art = require(__dirname + '/controllers/art.js');
        art.postData(req, res, "/artist-detail-image-edit/" + req.params.id, function(art){ // success
                req.flash('msgSuccess', "Image edited!");
                res.redirect("/artist-detail-image-edit/" + req.params.id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/artist-detail-image-edit/" + req.params.id);
            });
    });

    // process the image delete
    app.get('/artist-detail-image-delete/:id', isLoggedIn, function(req, res){
        var art = require(__dirname + '/controllers/art.js');
        art.deleteData(req, res, function(){ // success
                req.flash('msgSuccess', "Image deleted!");
                res.redirect("/admin");
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/admin");
            });
    });

    // show the venues page
    app.get('/venues', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var venues = require(__dirname + '/controllers/venues.js');
        venues.getData(req, res, 8, function(venues) {
            res.render('venues.ejs', {
                env : global.env,
                pageTitle : "NYCG | Venues",
                bodyClass : "venues",
                rss: {
                    title: "Venues",
                    path: "/venue"
                },
                venues : venues,
                infiniteScroll : '{ url : "' + apiUrl + '", ns : "venues", selector: ".nycg-listing", tmpl: "#tmpl-list", limit : 4, isLoading: false, status : true }', // pass the options
                user : (req.isAuthenticated()) ? req.user : false,
                isLoggedIn: req.isAuthenticated()
            });
        });
    });

    // show the venue profile edit page
    app.get('/venue-detail-edit', isLoggedIn, function(req, res) {
        var profile = require(__dirname + '/controllers/profile.js');
        profile.getData(req, res, function(profile) {
            res.render('venue-detail-edit.ejs', {
                env : global.env,
                pageTitle : "NYCG | Edit Profile",
                pageHeader : "Edit Profile",
                bodyClass : "venue-detail-edit",
                user : profile,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr'),
                isLoggedIn: true
            });
        });
    });

    // process the venue profile page
    app.post('/venue-detail-edit', function(req, res){
        var profile = require(__dirname + '/controllers/profile.js');
        profile.postData(req, res, passport, function(){ // success
                req.flash('msgSuccess', "Profile updated!");
                res.redirect("/venue-detail-edit");
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-edit");
            });
    });

    // show the venue image add page
    app.get('/venue-detail-image-add', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.render('venue-detail-image-add.ejs', {
            env : global.env,
            pageTitle : "NYCG | Upload New Images",
            pageHeader : "Upload New Images",
            bodyClass : "venue-detail-image-add",
            user : req.user,
            msgSuccess: req.flash('msgSuccess'),
            msgErr: req.flash('msgErr'),
            user : req.user,
            isLoggedIn: true
        });
    });

    // process the venue image add page
    app.post('/venue-detail-image-add', isLoggedIn, function(req, res){
        var photo = require(__dirname + '/controllers/photo.js');
        photo.postData(req, res, "/venue-detail-image-add", function(photo){ // success
                req.flash('msgSuccess', "Photo added!");
                res.redirect("venue-detail-image-edit/" + photo._id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-image-add");
            });
    });

    // show the venue detail image edit page
    app.get('/venue-detail-image-edit/:id', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var photo = require(__dirname + '/controllers/photo.js');
        photo.getDataById(req, res, function(photo) {
            res.render('venue-detail-image-edit.ejs', {
                env : global.env,
                pageTitle : "NYCG | Edit Single Work",
                pageHeader : "Edit Image",
                bodyClass : "venue-detail-image-edit",
                photo : photo,
                user : req.user,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr'),
                isLoggedIn: true
            });
        });
    });

    // process the venue detail image edit
    app.post('/venue-detail-image-edit/:id', isLoggedIn, function(req, res){
        var photo = require(__dirname + '/controllers/photo.js');
        photo.postData(req, res, "/venue-detail-image-edit/" + req.params.id, function(photo){ // success
                req.flash('msgSuccess', "Image edited!");
                res.redirect("/venue-detail-image-edit/" + req.params.id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-image-edit/" + req.params.id);
            });
    });

    // process the image delete
    app.get('/venue-detail-image-delete/:id', isLoggedIn, function(req, res){
        var photo = require(__dirname + '/controllers/photo.js');
        photo.deleteData(req, res, function(){ // success
                req.flash('msgSuccess', "Image deleted!");
                res.redirect("/admin");
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/admin");
            });
    });

    // show the venue event add page
    app.get('/venue-detail-event-add', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.render('venue-detail-event-add.ejs', {
            env : global.env,
            pageTitle : "NYCG | Add Event",
            pageHeader : "Add Event",
            bodyClass : "venue-detail-event-add",
            msgSuccess: req.flash('msgSuccess'),
            msgErr: req.flash('msgErr'),
            user : req.user,
            isLoggedIn: true
        });
    });

    // process the venue event add page
    app.post('/venue-detail-event-add', isLoggedIn, function(req, res){
        var artEvent = require(__dirname + '/controllers/event.js');
        artEvent.postData(req, res, "/venue-detail-event-add", function(artEvent){ // success
                req.flash('msgSuccess', "Event added!");
                res.redirect("venue-detail-event-edit/" + artEvent._id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-event-add");
            });
    });

    // show the venue event edit page
    app.get('/venue-detail-event-edit/:id', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var artEvent = require(__dirname + '/controllers/event.js'); // decided against using the word 'event'
        artEvent.getDataById(req, res, function(artEvent) {
            res.render('venue-detail-event-edit.ejs', {
                env : global.env,
                pageTitle : "NYCG | Edit Event",
                pageHeader : "Edit Event",
                bodyClass : "venue-detail-event-edit",
                artEvent: artEvent,
                user : req.user,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr'),
                isLoggedIn: true
            });
        });
    });

    // process the venue detail event edit
    app.post('/venue-detail-event-edit/:id', isLoggedIn, function(req, res){
        var artEvent = require(__dirname + '/controllers/event.js');
        artEvent.postData(req, res, "/venue-detail-event-edit/" + req.params.id, function(artEvent){ // success
                req.flash('msgSuccess', "Event edited!");
                res.redirect("/venue-detail-event-edit/" + req.params.id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-event-edit/" + req.params.id);
            });
    });

    // process the event delete
    app.get('/venue-detail-event-delete/:id', isLoggedIn, function(req, res){
        var artEvent = require(__dirname + '/controllers/event.js');
        artEvent.deleteData(req, res, function(){ // success
                req.flash('msgSuccess', "Event deleted!");
                res.redirect("/admin");
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/admin");
            });
    });

    // show the call to artists add page
    app.get('/venue-detail-call-add', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.render('venue-detail-call-add.ejs', {
            env : global.env,
            pageTitle : "NYCG | Add Call to Artists Listing",
            pageHeader : "Add Call to Artists Listing",
            bodyClass : "venue-detail-call-add",
            msgSuccess: req.flash('msgSuccess'),
            msgErr: req.flash('msgErr'),
            user : req.user,
            isLoggedIn: true
        });
    });

    // process the call to artists add page
    app.post('/venue-detail-call-add', isLoggedIn, function(req, res){
        var artEvent = require(__dirname + '/controllers/call.js');
        artEvent.postData(req, res, function(artEvent){ // success
                req.flash('msgSuccess', "Call to artists listing added!");
                res.redirect("venue-detail-call-edit/" + artEvent._id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-call-add");
            });
    });

    // show the call to artists edit page
    app.get('/venue-detail-call-edit/:id', isLoggedIn, function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var artEvent = require(__dirname + '/controllers/call.js'); // decided against using the word 'event'
        artEvent.getDataById(req, res, function(artEvent) {
            res.render('venue-detail-call-edit.ejs', {
                env : global.env,
                pageTitle : "NYCG | Edit Call to Artists Listing",
                pageHeader : "Edit Call to Artists Listing",
                bodyClass : "venue-detail-call-edit",
                artCall : artEvent,
                user : req.user,
                msgSuccess: req.flash('msgSuccess'),
                msgErr: req.flash('msgErr'),
                isLoggedIn: true
            });
        });
    });

    // process the call to artists edit
    app.post('/venue-detail-call-edit/:id', isLoggedIn, function(req, res){
        var artEvent = require(__dirname + '/controllers/call.js');
        artEvent.postData(req, res, function(artEvent){ // success
                req.flash('msgSuccess', "Event edited!");
                res.redirect("/venue-detail-call-edit/" + req.params.id);
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/venue-detail-call-edit/" + req.params.id);
            });
    });

    // process the call to artists delete
    app.get('/venue-detail-call-delete/:id', isLoggedIn, function(req, res){
        var artEvent = require(__dirname + '/controllers/call.js');
        artEvent.deleteData(req, res, function(){ // success
                req.flash('msgSuccess', "Listing deleted!");
                res.redirect("/admin");
            },
            function(errMsg){ //error
                req.flash('msgErr', errMsg);
                res.redirect("/admin");
            });
    });

    // show the contact form
    app.get('/contact', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.render('contact.ejs', {
            env : global.env,
            msgErr: req.flash('msgErr') ,
            msgSuccess: req.flash('msgSuccess') ,
            pageTitle : "NYCG | Contact",
            pageHeader : "Contact",
            bodyClass : "registration contact",
            user : (req.isAuthenticated()) ? req.user : false,
            isLoggedIn: req.isAuthenticated()
        });
    });

    // process the contact
    app.post('/contact', function(req, res){
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var contact = require(__dirname + '/controllers/contact.js');
        contact.postData(req, res, function(){ // success
            req.flash('msgSuccess', "Message sent!");
            res.redirect("/contact");
        },
        function(errMsg){ //error
            req.flash('msgErr', errMsg);
            res.redirect("/contact");
        });
    });

    // show the main rss page
    app.get('/feeds', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.render('rss.ejs', {
            env : global.env,
            pageTitle : "NYCG | RSS Feeds",
            pageHeader : "RSS Feeds",
            bodyClass : "rss",
            user : (req.isAuthenticated()) ? req.user : false,
            isLoggedIn: req.isAuthenticated()
        });
    });

    // show an rss feed
    app.get('/rss/:model', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        var rss = require(__dirname + '/controllers/recents.js');
        rss.getRecentItems(req, res, 20, function(items) {
            if (items && (req.params.model == "artist" || req.params.model == "venue" || req.params.model == "art" || req.params.model == "event" || req.params.model == "call")) {
                res.set('Content-Type', 'text/xml');
                res.render('rss-' + req.params.model + '.ejs', {
                    env : global.env,
                    items : items,
                });
            } else {
                req.flash('msgErr', "Sorry, no RSS found.");
                res.redirect("/");
            }
        });
    });

    // show the main rss feed
    app.get('/rss/static/main', function(req, res) {
        if(req.host == "nyc.gallery") res.redirect('/comingsoon');
        res.set('Content-Type', 'text/xml');
        res.render('rss-main.ejs', {
            env : global.env,
        });
    });

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
        req.flash('msgSuccess', "You've been logged out.")
		res.redirect('/');
	});

    // PASSPORT =========================
    app.get('/passport', function(req, res) {
        res.render('passport.ejs');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
        // LOGIN / REGISTER ===============================
        // show the login and register form
        app.get('/login-register', function(req, res) {
            if(req.host == "nyc.gallery") res.redirect('/comingsoon');
            res.render('login-register.ejs', {
                env : global.env,
                msgErr: req.flash('errRestricted') ,
                pageTitle : "NYCG | Login / Register",
                pageHeader : "Login / Register",
                bodyClass : "registration login-register",
                user : (req.isAuthenticated()) ? req.user : false,
                isLoggedIn: req.isAuthenticated()
            });
        });

		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
            if(req.host == "nyc.gallery") res.redirect('/comingsoon');
			res.render('login.ejs', {
                env : global.env,
                msgErr: req.flash('msgErr') ,
                pageTitle : "NYCG | Login",
                pageHeader : "Login",
                bodyClass : "registration login",
                user : (req.isAuthenticated()) ? req.user : false,
                isLoggedIn: req.isAuthenticated()
            });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/admin', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		//app.get('/signup', function(req, res) {
			//res.render('signup.ejs', { message: req.flash('msgErr') });
		//});

		// process the signup form
		//app.post('/signup', passport.authenticate('local-signup', {
			//successRedirect : '/artist-detail-admin', // redirect to the secure profile section
			//failureRedirect : '/signup', // redirect back to the signup page if there is an error
			//failureFlash : true // allow flash messages
		//}));

        // REGISTER =================================
        // show the register form
        app.get('/register', function(req, res) {
            if(req.host == "nyc.gallery") res.redirect('/comingsoon');
            res.render('register.ejs', {
                env : global.env,
                msgErr: req.flash('msgErr'),
                pageTitle : "NYCG | Register",
                pageHeader : "Register",
                user : (req.isAuthenticated()) ? req.user : false,
                bodyClass : "registration login"
            });
        });

        // process the register form
        app.post('/register', passport.authenticate('local-signup', {
            successRedirect : '/admin', // redirect to the secure profile section
            failureRedirect : '/register', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/admin',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/admin',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/admin',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('msgErr') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/admin', // redirect to the secure profile section
			failureRedirect : '/admin', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/admin',
				failureRedirect : '/admin'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/admin',
				failureRedirect : '/admin'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/admin',
				failureRedirect : '/admin'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/admin');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/admin');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/admin');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/admin');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
    req.flash('errRestricted', 'Sorry, you need to be logged in.');
	res.redirect('/login-register');
}