module.exports = function(app) {

    app.get('/', function(req, res) {

        res.render('photos.ejs', {
            env : global.env,
            pageTitle : "Photos",
            section : "photos",
            msgSuccess: false,
            msgErr: false
        });

    });

    app.get('/upload', function(req, res) {

        res.render('upload.ejs', {
            env : global.env,
            pageTitle : "Upload",
            section : "upload",
            msgSuccess: false,
            msgErr: false
        });

    });

    app.post('/upload', function(req, res){

        var photoController = require(__dirname + '/controllers/photos.js');

        photoController.postData(req, function(photo){ // success
            res.render('upload.ejs', {
                env : global.env,
                pageTitle : "Upload",
                section : "upload",
                photo : photo,
                msgSuccess: "Image uploaded!",
                msgErr: false
            });
        },

        function(errMsg){ //error
            res.render('upload.ejs', {
                env : global.env,
                pageTitle : "Upload",
                section : "upload",
                msgSuccess: false,
                msgErr: errMsg
            });
        });

    });

    app.get('/app.appcache', function(req, res) {
        res.header("Content-Type", "text/cache-manifest");
        res.render('appcache.ejs');
    });

};