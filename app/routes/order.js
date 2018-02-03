

module.exports = (app) => {

	var controller  = app.controllers.order;
	var session		= app.controllers.session;

	app.route('/pos/:pos_id/order')

		.post(session.checkLoginClient, controller.findPos, controller.createOrder)
		;

	app.route('/client/orders')
		
		.get(session.checkLoginClient, controller.getClientOrders)
		;

	app.route('/order')

		.get(session.checkLoginPos, controller.callOrders)
		;


	app.route('/order/:order_id')

		.get(session.checkLoginPos, controller.callSingleOrder)
		;


	app.route('/order/:order_id/status')
		
		.put(session.checkLoginPos, controller.updateStatus)
		;

};