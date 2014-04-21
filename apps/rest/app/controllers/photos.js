module.exports = {

    getRecent: function(date, limit, callback){

        var Photo = require('../../app/models/photo'); // photo model
        // use escape(date);

        var query = Photo
            .find()
            .where('date').lt(decodeURI(date))
            .limit(limit)
            .sort('-date')
            .exec(function (error, photos) {
                if (error) {
                    console.log("error getting photo data");
                    callback(false);
                } else {
                    callback(result);
                }
            });

    }

}