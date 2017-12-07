

module.exports = (app) => {

	var controller = {};

	controller.checkLogin = (req, res, next) => {
		next();
	};

	controller.checkLoginPos = (req, res, next) => {
		req.body.pos = { 'pos_id': 'pao_mel' };
		next();
	};

	controller.checkLoginClient = (req, res, next) => {
		req.body.client = { 'username': 'daniel' };
		next();
	};

	return controller;
}