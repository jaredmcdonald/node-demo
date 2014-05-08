/*******************************************************************************
 *
 * setup
 *
 *******************************************************************************/

var ENV         = process.env.NODE_ENV || 'dev';
var port        = process.env.PORT || 3000;
var restify     = require('restify');
var mongoose    = require('mongoose');
var configDB    = require('./config/database.js');
var server      = restify.createServer({ name: 'mongo-api' });

/*******************************************************************************
 *
 * configuration
 *
 *******************************************************************************/

mongoose.connect(configDB.url); // connect to our database

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

/*******************************************************************************
 *
 * routes
 *
 *******************************************************************************/

require('./app/routes.js')(server);

/*******************************************************************************
 *
 * launch
 *
 *******************************************************************************/

server.listen(port, function () {
	console.log('%s listening at %s', server.name, server.url)
});