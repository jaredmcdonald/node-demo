define([
	'underscore',
  'backbone'
], function(_, Backbone){

  var AppRouter = Backbone.Router.extend({
  	// ---- any route handlers would go below like so
    // ---- routes: {
    // ----  "page/:number": "showPhotos"
    // ---- }
  });

	return AppRouter;

});