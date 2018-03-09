

// Utils Auth 
const utils_auth = require("../../utils/auth.js");

module.exports = (app) => {

	const Client = app.models.client;
	const Pos	 = app.models.pos;

	var controller = {};

	controller.checkLoginGeneral = (req, res, next) => {
		
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else {
			utils_auth.decodeToken(token, (err, user) => {
				console.log(user);
				if(user.scope === 'client'){
					findUser(req, res, next, Client, user.scope, token);
				}
				else if(user.scope === 'pos'){
					findUser(req, res, next, Pos, user.scope, token);
				}
			});
		}

	};

	controller.checkLoginPos = (req, res, next) => {
		
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else{
			findUser(req, res, next, Pos, 'pos', token);
		}
	};


	controller.checkLoginClient = (req, res, next) => {
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else{
			findUser(req, res, next, Client, 'client', token);
		}
	};
	
	// check just token, do not go to DB
	controller.checkLoginPosByToken = (req, res, next) => {
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else{
			findUserIdInToken(token, 'pos', req, res, next);
		}
	};

	// check just token, do not go to DB
	controller.checkLoginClientByToken = (req, res, next) => {
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else{
			findUserIdInToken(token, 'client', req, res, next);
		}
	};


	// Support Function
	
	function findUser(req, res, next, Collection, scope, token){
		Collection
			.findOne({"tokenList": token, "isActive": true})
			.exec()
			.then(
				function(user){
					if(user){
						if (scope === 'client')
							req.body.client = user;
						else
							req.body.pos = user;
						next();
					}
					else
						res.sendStatus(401);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	};

	function findUserIdInToken(token, scope, req, res, next) {
		utils_auth.decodeToken(token, (err, user) => {
			
			if(err) {
				console.log(err);
				res.sendStatus(500);
			}
			else if(scope === user.scope) {
				req.body[scope] = user;
				next();
			}
			else {
				res.sendStatus(403);
			}
			

		});
	}

	return controller;
}