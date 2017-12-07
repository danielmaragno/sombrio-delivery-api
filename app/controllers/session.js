

module.exports = (app) => {

	var controller = {};

	controller.checkLogin = (req, res, next) => {
		next();
	};

	controller.checkLoginPos = (req, res, next) => {
		req.body.pos = { 'id': 'pao_mel' };
		next();
	};

	controller.checkLoginClient = (req, res, next) => {
		req.body.client = { 'id': 'daniel' };
		next();
	};

	return controller;
}