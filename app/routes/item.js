

module.exports = (app) => {

	var controller  = app.controllers.item;
	var session		= app.controllers.session;

	app.route('/pos/:pos_id/items')

		.get(session.checkLoginGeneral, controller.callItemsByPos)
		;

	app.route('/item')

		.post(session.checkLoginPos, controller.createItem)
		.put(session.checkLoginPos, controller.editItemPrice)
		;
	
	app.route('/item/:id')
		.delete(session.checkLoginPos, controller.removeItem)
};