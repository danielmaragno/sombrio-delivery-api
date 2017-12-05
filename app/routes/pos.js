

module.exports = (app) => {

	var controller  = app.controllers.pos;
	var session 	= app.controllers.session;


	app.route('/pos/')

		.get(session.checkLoginPos, controller.findPosPos);
		.put(session.checkLoginPos, controller.updatePos);

	app.route('/pos/:pos_id')

		.get(session.checkLoginClient, controller.findSpecificPos);
}