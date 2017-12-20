

module.exports = (app) => {

	var controller  = app.controllers.item;
	var session		= app.controllers.session;

	app.route('/pos/:pos_id/items')

		.get(session.checkLoginGeneral, controller.callItemsByPos)
		;

	app.route('/item')

		.put(session.checkLoginPos, controller.editItem)
		;
};