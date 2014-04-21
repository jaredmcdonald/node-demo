// depends on options.maxFileSize, options.redirectUrl, options.dimensions, options.path, options.dir
module.exports = function(req, res, entry, validator, fs, gm, aws, s3, ImageData, options, successCallback) {

    var now = new Date().getTime(),
        imgPath = req.files.upload_img.path,
        imgName = req.files.upload_img.name,
        friendlyName = now + imgName.replace(/[^a-z0-9.]/gi, '_').toLowerCase(); // removes anything that's not letter or number or period and makes lower case

    var cdnPost = function(src, thumbSrc) { // post to cdn

        // createClient allows any options that knox does.
        var client = s3.createClient({
            key: aws.key,
            secret: aws.secret,
            bucket: aws.bucket
        });

        // optional headers
        var headers = { 'x-amz-acl' :'public-read' };

        // upload a file to s3
        var upload = function(imgFile, dest, callback){
            var uploader = client.upload(imgFile, dest, headers);
            uploader.on('error', function(cdnErr) {
                console.error("unable to upload:", cdnErr.stack);
                req.flash('msgErr', "Sorry there's a problem with the image.");
                res.redirect(options.redirectUrl);
            });
            uploader.on('end', function(url) {
                callback(url);
            });
        };

        upload(src, options.dir + "/" + friendlyName, function(url){
            entry.pic_cdn = url;
            upload(thumbSrc, "thumbs/" + options.dir + "/" + friendlyName, function(url){
                entry.pic_thumb = url;
                entry.save(function(saveErr) {
                    if (saveErr) {
                        req.flash('msgErr', 'There was an issue. Try again.');
                        res.redirect(options.redirectUrl);
                    } else {
                        // lastly save the exif data
                        gm(imgPath)
                        .identify(function (dataErr, data) {
                            if (!dataErr) {
                                var imgData = new ImageData();
                                imgData.path = "./public" + options.path + "/" + options.dir + "/" + friendlyName;
                                imgData.props = data;
                                imgData.save(function(dataSaveErr){
                                    if(dataSaveErr) console.log(dataSaveErr);
                                    successCallback();
                                });
                            } else { // no exif data so run it anyway
                                console.log(dataErr);
                                successCallback();
                            }
                        });
                    }
                });
            });
        });
    };

    var createLocalCopy = function(dest, w, h, squareThumb, callback) { // preview resize

        gm(imgPath).size(function(sizeErr, imgSize){

            var resizeCopy = function(){
                if(squareThumb && typeof imgSize !== "undefined" ) { // if we have the width and height info

                    if(imgSize.width >= imgSize.height) {
                        var newWidth = null,
                            newHeight = h;
                    } else {
                        var newWidth = w,
                            newHeight = null;
                    }

                    gm(imgPath)
                        .autoOrient()
                        .noProfile()
                        .resize(newWidth, newHeight)
                        .gravity("Center")
                        .crop(w, h, 0, 0)
                        .quality(90)
                        .write(dest, function (uploadErr) {
                            if (!uploadErr) {
                                callback();
                            } else {
                                req.flash('msgErr', "Sorry there's an issue with the image.");
                                console.log(uploadErr);
                                res.redirect(options.redirectUrl);
                            }
                        });

                } else {

                    gm(imgPath)
                        .resize(w)
                        .autoOrient()
                        .noProfile()
                        .quality(90)
                        .write(dest, function (uploadErr) {
                            if (!uploadErr) {
                                callback();
                            } else {
                                req.flash('msgErr', "Sorry there's an issue with the image.");
                                console.log(uploadErr);
                                res.redirect(options.redirectUrl);
                            }
                        });

                }
            };

            if(imgSize !== "undefined" && options.minWidth !== "undefined" ) { // if the image is smaller than minWidth

                if(imgSize.width < options.minWidth) {
                    req.flash('msgErr', "Featured image needs to be at least " + options.minWidth + "px wide. Yours is " + imgSize.width + "px. Please resize.");
                    console.log('image is only ' + imgSize.width + 'px wide');
                    res.redirect(options.redirectUrl);
                } else {
                    resizeCopy();
                }

            } else { // image is wide enough so proceed
                resizeCopy();
            }

        });

    };

    var initUpload = function(){
        // if fail file extension validation
        if( /\.(?:jpe?g|png|gif)$/.test(friendlyName) == false  ) {
            req.flash('msgErr', "Sorry there's a problem with the filename or type. Must be .jpg, .png, or .gif");
            res.redirect(options.redirectUrl);
        } else {
            // file size validation
            gm(imgPath)
            .filesize(function (sizeErr, filesize) { // first get the size - K or M
                var startUpload = function() {
                    createLocalCopy("./public" + options.path + "/" + options.dir + "/" + friendlyName, options.dimensions.width, options.dimensions.height, false, function(){
                        entry.pic = options.path + "/" + options.dir + "/" + friendlyName;
                        createLocalCopy("./public" + options.path + "/thumbs/" + options.dir + "/" + friendlyName, options.dimensions.tWidth, options.dimensions.tHeight, options.squareThumb, function(){
                            entry.pic_thumb = options.path + "/thumbs/" + options.dir + "/" + friendlyName;
                            cdnPost("./public" + options.path + "/" + options.dir + "/" + friendlyName, "./public" + options.path + "/thumbs/" + options.dir + "/" + friendlyName);
                        });
                    });
                };
                if(!sizeErr) {
                    if(filesize.indexOf("M") != -1) {
                        var sizeFloat = parseFloat(filesize.replace("M", ""));
                        if(sizeFloat > options.maxFileSize) { // if too large
                            req.flash('msgErr', 'This image is larger than ' + options.maxFileSize + 'mb. Please optimize (Google "save for web").');
                            res.redirect(options.redirectUrl);
                        } else {
                            startUpload();
                        }
                    } else {
                        startUpload(); // continue anyway
                    }
                } else {
                    startUpload(); // continue anyway
                }
            });
        }
    };

    initUpload();
};