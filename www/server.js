/*******************************************************************************
 *
 * setup
 *
 *
 *******************************************************************************/

var env         = process.env.NODE_ENV || 'dev'
var port        = process.env.PORT || 8080;
var express     = require('express');
var ejs         = require('ejs');
var mongoose    = require('mongoose');
var configDB    = require('./config/database.js');
var app         = express();
global.env      = env;
global.rest     = "http://localhost:3000/api";

/*******************************************************************************
 *
 * configuration
 *
 *******************************************************************************/

mongoose.connect(configDB.url);				// connect to our database

app.configure(function() {
	// set up our express application
	app.use(express.logger('dev'));			// log every request to the console
	app.use(express.cookieParser());		// read cookies (needed for auth)
	app.use(express.bodyParser());			// get information from html forms
	app.set('view engine', 'ejs');			// set up ejs for templating	
	app.use(express.static(__dirname + "/public")); // make the public folder accessible
});

/*******************************************************************************
 *
 * routes
 *
 *******************************************************************************/

require('./app/routes.js')(app);			// load our routes

/*******************************************************************************
 *
 * launch
 *
 *******************************************************************************/

app.listen(port, function () {
	console.log('%s listening at port %s', app.name, port)
});