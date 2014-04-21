// load the things we need
var mongoose = require('mongoose');

// define the schema for our photo model
var photoSchema = mongoose.Schema({

    title            : String,
    path             : String,
    date             : { type: Date, default: Date.now },

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Photo', photoSchema);