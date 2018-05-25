
var randomstring = require("randomstring");

// Utils Auth 
const utils_auth = require("../../utils/auth.js");



module.exports = (app) => {

	const Admin = app.models.admin;

	var controller = {};

	//
	// Authentication 
	//
	
	controller.login = function(req, res) {

		const info = req.body.info;

		Admin
			.findOne({'id': info.id})
			.exec()
			.then(
				function(admin){
					// Not found (send 403 for security issues)
					if(!admin)
						res.sendStatus(403);

					// Compare passwd
					else if(!utils_auth.comparePasswords(info.passwd, admin.passwd))
						res.sendStatus(403);

					else {
						const token = randomstring.generate(40);

						Admin
							.update({'id': admin.id},{"$push": {"tokenList": token}})
							.exec()
							.then(
								function(){
									res.send({'token': token}).status(200)
								},
								function(err){
									console.log(err);
									res.sendStatus(500);
								}
							)
					}


				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)

	}

	controller.logout = function(req, res) {
		
		const token = req.headers['x-access-token'];

		Admin
			.update({'tokenList': token},{"$pull": {"tokenList": token}})
			.exec()
			.then(
				function(){
					res.sendStatus(200);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	}

	controller.checkLogedIn = function(req, res, next) {
		
		const token = req.headers['x-access-token'];

		Admin
			.find({'tokenList': token})
			.exec()
			.then(
				function(admins){
					if(admins.length)
						next();
					else
						res.sendStatus(403);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	}



	return controller;

};