

module.exports = (app) => {

	var controller  = app.controllers.pos;
	var session 	= app.controllers.session;

	// Route for POS
	app.route('/pos/')

		.get(session.checkLoginPos, controller.findPosPos)
		.put(session.checkLoginPos, controller.updatePosPos)
		;


	// Route for CLIENT
	app.route('/pos/:pos_id')

		.get(session.checkLoginClient, controller.findSpecificPosClient)
		;
}