/*******************************************************************************
 *
 * setup
 *
 *
 *******************************************************************************/

var env = process.env.NODE_ENV || 'dev'
    , port  = process.env.PORT || 8080,
    , express = require('express'),
    , ejs = require('ejs'),
    , mongoose = require('mongoose'),
    , configDB = require('./config/database.js'),
    , app = express();

/*******************************************************************************
 *
 * configuration
 *
 *******************************************************************************/

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// ejs filters
ejs.filters.cleanTruncate = function(name) {
    var cleaned = name.replace(/<[^>]*>?/g, '');
    return cleaned;
};
ejs.filters.toDate = function(d) {
    var newDate = new Date(d);
    return newDate;
};
ejs.filters.sanitizeTruncate = function(str, len){
    var cleaned = str.replace(/<[^>]*>?/g, '');
    return cleaned.substring(0, len) + "...";
};

app.configure(function() {
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
	app.set('view engine', 'ejs'); // set up ejs for templating
	// required for passport
	app.use(express.session({ secret: 'adamadamadamadamadamadamadamadam' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
    // less
    app.use(lessMiddleware({
        src: __dirname + "/less",
        dest: __dirname + "/public/css",
        prefix: "/css",
        // force = true - recompiles on every request
        force: (env == 'dev') ? true : false,
        // once = true - recompile once after each server restart
        once: (env == 'dev') ? false : true
    }));
    app.use(express.static(__dirname + "/public"));
});

/*******************************************************************************
 *
 * routes
 *
 *******************************************************************************/

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

/*******************************************************************************
 *
 * launch
 *
 *******************************************************************************/

app.listen(port, function () {
    console.log('%s listening at port %s', app.name, port)
});