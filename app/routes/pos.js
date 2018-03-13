

module.exports = (app) => {

	var controller  = app.controllers.pos;
	var session 	= app.controllers.session;

	// Route for POS
	app.route('/pos/')

		.get(session.checkLoginPos, controller.findPosPos)
		.put(session.checkLoginPos, controller.updatePosPos)
		;


	// Route for CLIENT
	app.route('/pos/:id')

		.get(session.checkLoginClient, controller.findSpecificPosClient)
		;

	app.route('/city/:city/pos')

		.get(session.checkLoginClient, controller.finPossByCategory)
		;

	app.route('/pos/player_id')

		.post(session.checkLoginPos, controller.pushPlayerId)
		;

}