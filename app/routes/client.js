

module.exports = (app) => {

	var controller  = app.controllers.client;
	var session 	= app.controllers.session;

	// Route for POS
	app.route('/client')

		.get(session.checkLoginClient, controller.findClient)
		.put(session.checkLoginClient, controller.updateClient)
		.post(controller.createClient)
		;
};