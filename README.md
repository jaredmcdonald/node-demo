An Example Node Website
====

An example Node website and API. This is an example using Express framework for the website and a Restify based API - two web apps working together. Backbone is used on the front end to assist in this interaction.

##What is Node##

> Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

~ [nodejs.org](http://nodejs.org/ "nodejs.org")

##What This Example Includes##

* Express - A web aplication framework for Node.
* Restify - A node module built specifically for REST web services.
* MongoDB - A document based database. Important concepts - "Dynamic schemas", "collections", "documents".
* Mongoose - A Node module to make Mongo communication easier - mongodb object modeling.
*	EJS - A templating framework to present views.
* Backbone - Using [Local Storage Adapter](https://github.com/jeromegn/Backbone.localStorage "Local Storage Adapter").
* RequireJS
* SASS
* Compass
* Grunt - Compass contrib, Require contrib (using r.js)
* Important concepts - MVC/ MVP, AMD (Asynchronous Modular Definition)

##Getting Started##

*	[My Example .gitignore for Node Projects](.gitignore "Example .gitignore for Node Projects")
* **NOTE:** If using this code you will need to create an upload path "/www/public/images/uploads" as .gitignore ignores it.
*	[Install Node](http://nodejs.org/download/ "Install Node")
*	[NPM - Node Package Manager](https://www.npmjs.org "NPM - Node Package Manager") - Installs, publishes and manages node programs.
*	[package.json](https://www.npmjs.org/doc/json.html "package.json") - Configuration object for the project
*	[Install and Setup Mongo](http://docs.mongodb.org/manual/installation/ "Install and Setup Mongo")
*	[Install the Grunt CLI](http://gruntjs.com/getting-started "Grunt | Getting Started")
* Start Mongo (see documentation above)
* Navigate to the API directory: 
```
cd /apps/rest
```
* Install dependencies (uses package.json): 
```
npm install
```
* Start the API server: 
```
node server.js
```
* Open new tab in shell
* Navigate to the website directory: 
```
cd /www
```
* Install dependencies (uses package.json): 
```
npm install
```
* Start the website server: 
```
node server.js
```
* At any time concatenate JS and SCSS to CSS by running "Grunt" in the website directory (/www)
* By default we've set this up to use "/www/public/js/main-dev.js" as our JS entry point. To use the minified version ("main.js") set the node environment to production in the command line like so "set NODE_ENV = production". See "/views/inc/bottom.ejs" for logic.

####Helpful links####

*	[Node.js Style Guide](https://github.com/felixge/node-style-guide "Node.js Style Guide") authored by Felix Geisendörfer
*	[package.json - An interactive guide](http://package.json.nodejitsu.com "package.json - An interactive guide") published by Nodejitsu