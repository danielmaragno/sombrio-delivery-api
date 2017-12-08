

module.exports = (app) => {

	var controller  = app.controllers.order;
	var session		= app.controllers.session;

	app.route('/pos/:pos_id/order')

		.post(session.checkLoginClient, controller.findPos, controller.createOrder)
		;
};