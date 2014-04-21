var Art = require('../../app/models/art'); // art model

module.exports = {

    getData: function(req, res, limit, callback){

        var query = Art
            .find()
            .where('uid').equals(req.user._id)
            .limit(limit)
            .sort('-date')
            .exec(function (error, art) {
                if (error) {
                    console.log("error getting art data");
                    callback(false);
                } else {
                    callback(art);
                }
            });

    },

    getDataById: function(req, res, callback){

        var query = Art
            .findOne()
            .where('_id').equals(req.params.id)
            .exec(function (error, art) {
                if (error) {
                    console.log("error getting art data");
                    callback(false);
                } else {
                    callback(art);
                }
            });

    },

    postData: function(req, res, parentRedirect, successCallback, errCallback) {

        var ImageData = require('../../app/models/imageData'), // image model
            // validator
            validator = require('validator'),
            // file dependencies
            fs = require('fs'),
            gm = require('gm'),
            // AWS creds
            aws = require('../../config/aws.js'),
            // s3
            s3 = require('s3'),
            // profile image utility
            artImage = require('../../app/controllers/image-resize'),
            // validation params
            maxFileSize = 5;

        // validate form fields
        var validationErr = "";
        // Title
        if(!validator.isLength(req.body.title, 1 , 40)) validationErr += 'Title must be between 1 and 40 characters. ';
        var friendlyTitle = validator.escape(req.body.title); // escape all html
        friendlyTitle = friendlyTitle.replace(/&amp;/g, '&'); // add ampersands back
        // Medium
        var friendlyMedium = req.body.medium;
        if(friendlyMedium != "") {
            if(!validator.isLength(friendlyMedium, 1 , 40)) {
                validationErr += 'Medium must be between 1 and 40 characters. ';
            } else {
                friendlyMedium = validator.escape(friendlyMedium); // escape all html
                friendlyMedium = friendlyMedium.replace(/&amp;/g, '&'); // add ampersands back
            }
        }

        // respond to validation
        if(validationErr != "") {

            errCallback(validationErr + 'Try again.');

        } else if(typeof req.params.id !=='undefined' && req.files.upload_img.name == '') { // if we're just saving info and no image

            Art.findOne({ '_id' : req.params.id }, function(findErr, art) {
                if (findErr) {
                    console.log("Data connection issue.");
                    errCallback("Submission failed, sorry. Error: no info data connection.");
                } else if (!art) { // we need to have one
                    console.log("Data connection issue.");
                    errCallback("Submission failed, sorry. Error: no data.");
                } else {
                    if(art.uid != req.user._id) { // the user id does't match the user id of the image :/
                        console.log("identity issue.");
                        errCallback("Submission failed, sorry.");
                    } else {
                        art.title          = friendlyTitle;
                        art.medium         = friendlyMedium;
                        art.save(function(saveDataErr) {
                            if(saveDataErr) errCallback("Submission failed, sorry.");
                            else successCallback(art);
                        });
                    }
                }
            });

        } else { // validate and submit image and user data

            Art.findOne({ '_id' : req.params.id }, function(findErr, art) {

                if (findErr) {

                    console.log("Data connection issue.");
                    errCallback("Submission failed, sorry. Error: no data connection.");

                } else {

                    var newArt = (art) ? art : new Art(); // if we're editing (saving)

                    if(art && art.uid != req.user._id) { // the user id does't match the user id of the image :/

                        console.log("identity issue.");
                        errCallback("Submission failed, sorry.");

                    } else {

                        var artImageInstance = new artImage(req, res, newArt, validator, fs, gm, aws, s3, ImageData, {
                                maxFileSize: maxFileSize,
                                path: "/images/uploads",
                                dir: "art",
                                redirectUrl: parentRedirect,
                                squareThumb: true,
                                dimensions: { width:600, height:800, tWidth:230, tHeight:230 }
                            },
                            function(){
                                newArt.uid            = req.user._id;
                                newArt.title          = friendlyTitle;
                                newArt.medium         = friendlyMedium;
                                newArt.save(function(saveDataErr) {
                                    if(saveDataErr) errCallback("Submission failed, sorry.");
                                    else successCallback(newArt);
                                });
                            });

                    }
                }
            });

        }

    },
    deleteData: function(req, res, successCallback, errCallback) {

        if(typeof req.params.id !=='undefined') {

                Art.findOne({ '_id' : req.params.id }, function(findErr, art) {

                    if (findErr) {
                        console.log("Data connection issue.");
                        errCallback("Delete failed, sorry. Error: no info data connection.");
                    } else {

                        if(art.uid != req.user._id) { // the user id does't match the user id of the image :/
                            console.log("identity issue.");
                            errCallback("Delete failed, sorry.");
                        } else {

                            Art.remove({ '_id' : req.params.id }, function (findRemoveErr) {
                                if (findRemoveErr) {
                                    console.log("Data connection issue.");
                                    errCallback("Delete failed, sorry. Error: no info data connection.");
                                } else {
                                    successCallback();
                                }
                            });

                        }

                    }
                });

        } else {

            console.log("Image not found.");
            errCallback("Delete failed, sorry.");

        }

    }

}