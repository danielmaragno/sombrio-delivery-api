
module.exports = (app) => {

	var controller = app.controllers.category;

	app.route('/category')
		.get(controller.callCategories);
		;

}