module.exports = function(app) {

	// show the home page
	app.get('/', function(req, res) {
		res.render('photos.ejs', {
			env : global.env,
			section : "photos",
			pageTitle : "Photos",
			description : "A compilation of photos."
		});
	});

	// show the upload form page
	app.get('/upload', function(req, res) {
		res.render('upload.ejs', {
			env : global.env,
			section : "upload",
			pageTitle : "Upload",
			description : "Add to the compilation of photos."
		});
	});

	// handle upload post
	app.post('/upload', function(req, res){
		var photoController = require(__dirname + '/controllers/photos.js');
		photoController.postData(req, function(photo){ // success
			res.render('upload.ejs', {
				env : global.env,
				pageTitle : "Upload",
				section : "upload",
				photo : photo,
				msgSuccess: "Image uploaded!"
			});
		},
		function(errMsg){ //error
			res.render('upload.ejs', {
				env : global.env,
				pageTitle : "Upload",
				section : "upload",
				msgErr: errMsg
			});
		});
	});

	// application cache
	app.get('/app.appcache', function(req, res) {
		res.header("Content-Type", "text/cache-manifest");
		res.render('appcache.ejs');
	});

};