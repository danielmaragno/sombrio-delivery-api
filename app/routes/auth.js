

module.exports = (app) => {

	var controller  = app.controllers.auth;
	
	// Route for POS
	app.route('/auth/login')

		.post(controller.login)
		;

	app.route('/auth/logout')

		.get(controller.logout)
		;

	app.route('/auth/account-confirm')

		.get(controller.confirmAccount)
		;

	app.route('/auth/recovery-passwd')

		.get(controller.recoveryPasswd)
		;
};