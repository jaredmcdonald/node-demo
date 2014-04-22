var fs = require("fs");
var Photo = require('../../app/models/photos'); // photos model

module.exports = {

    postData: function(req, successCallback, errorCallback) {

        var now = new Date().getTime();
        var imgPath = req.files.upload.path;
        var imgName = req.files.upload.name;
        var friendlyName = now + imgName.replace(/[^a-z0-9.]/gi, '_').toLowerCase(); // removes anything that's not letter or number or period and makes lower case

        if(req.files.upload.name != '') { // if we have a file with the name 'upload'
            fs.readFile(imgPath, function (err, data) {
                var newPath = "./public/images/uploads/" + friendlyName;
                var url = "/images/uploads/" + friendlyName;
                fs.writeFile(newPath, data, function (err) {
                    if(err) {
                        errorCallback("Upload failed, sorry :/");
                    } else {
                        var newPhoto = new Photo();
                        newPhoto.title = req.body.title;
                        newPhoto.path = url;
                        newPhoto.save(function(err) {
                            if(err) errorCallback("data problem. fail. sorry :/");
                            else successCallback(newPhoto);
                        });
                    }
                });
            });
        } else {
            errorCallback("No image :/");
        }

    }

}