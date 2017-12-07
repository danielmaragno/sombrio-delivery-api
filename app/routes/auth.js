

module.exports = (app) => {

	var controller  = app.controllers.auth;
	
	// Route for POS
	app.route('/auth/login')

		.post(controller.login)
		;

	app.route('/auth/logout')

		.get(controller.logout)
		;
};