

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
	// CATEGORY Control
	//

	app.route('/admin/category')
		.get(controller.checkLogedIn, controller.callCategories)
		.put(controller.checkLogedIn, controller.updateCategory)
		.delete(controller.checkLogedIn, controller.deleteCategory)

	//
	// POS Control
	//

	app.route('/admin/pos')
		.post(controller.checkLogedIn, controller.createPos)

	app.route('/admin/pos/pos/:id')
		.get(controller.checkLogedIn, controller.getPosById)
		.put(controller.checkLogedIn, controller.updatePos)

	app.route('/admin/pos/city/:city')
		// GET Poss by city name
		.get(controller.checkLogedIn, controller.getPossByCity)

	app.route('/admin/pos/distinct-cities')
		.get(controller.checkLogedIn, controller.distinctCities)

}