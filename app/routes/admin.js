

module.exports = (app) => {

	const controller = app.controllers.admin;

	//
	// Authentication
	//
	
	app.route('/admin/login')
		.post(controller.login);

	app.route('/admin/logout')
		.get(controller.logout);


	//
	// POS Constrol
	//

	app.route('/admin/pos')
		.post(controller.checkLogedIn, controller.createPos)

}