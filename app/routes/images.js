
module.exports = (app) => {

	var controller  = app.controllers.images;
	var session 	= app.controllers.session;

	// Route for POS
	app.route('/images')

		.get(session.checkLoginPos, controller.getImages)
		;
};