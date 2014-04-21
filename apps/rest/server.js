/*******************************************************************************
 *
 * setup
 *
 *******************************************************************************/

var env = process.env.NODE_ENV || 'dev' // for production run: NODE_ENV=production node server.js
    , port  = process.env.PORT || 3000
    , restify = require('restify')
    , mongoose = require('mongoose')
    , configDB = require('./config/database.js')
    , server = restify.createServer({ name: 'mongo-api' });

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