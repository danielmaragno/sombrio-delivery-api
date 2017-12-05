

module.exports = (app) => {

	var controller = {};

	controller.checkLogin = (req, res, next) => {
		next();
	};

	controller.checkLoginPos = (req, res, next) => {
		next();
	};

	controller.checkLoginClient = (req, res, next) => {
		next();
	};

	return controller;
}