module.exports = function(server){

    server.get('/photos/:date/:limit', function (req, res, next) {

        var photo = require(__dirname + '/controllers/photos.js');

        photo.getRecent(req.params.date, req.params.limit, function(photos) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            if(!photos) res.end(JSON.stringify([])); // if error
            else res.end(JSON.stringify(photos));
        });

        return next();

    });

}