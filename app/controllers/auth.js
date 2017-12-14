


// Utils Auth 
const utils_auth = require("../../utils/auth.js");

module.exports = (app) => {

	const Client = app.models.client;
	const Pos	 = app.models.pos;

	var controller = {};

	//
	//	LOGIN
	//

	controller.login = function(req, res){

		const info = req.body.info;

		// We need this 'cause a bug in Mongoose tha find something in 'undefined' case.
		if(info && info.scope && info.id){
			switch(info.scope){
				case 'client':
					execLogin(res, info, Client);
					break;
				case 'pos':
					execLogin(res, info, Pos);
					break;
				default:
					res.sendStatus(400);
			}
		}

		else
			res.sendStatus(400);

		
	};


	function execLogin(res, info, Collection){
		Collection
			.findOne({'id': info.id})
			.exec()
			.then(
				function(user){
					// Not found (send 403 for security issues)
					if(!user)
						res.sendStatus(403);
					
					// Compare passwd
					else if(!utils_auth.comparePasswords(info.passwd, user.passwd))
						res.sendStatus(403);

					// LoginOK
					else{
						const token = utils_auth.generateToken(user);
						Collection
							.update({'_id': user._id},{'$push': {'tokenList': token}})
							.exec()
							.then(
								function(){
									res.status(200).send({'token': token})
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
	};

	//
	//	LOGOUT
	//

	controller.logout = function(req, res){
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(404);

		else{
			utils_auth.decodeToken(token, function(err, verifiedUser){
				if(err)
					res.sendStatus(500);
				else{
					switch(verifiedUser.scope){
						case 'client':
							execLogout(res, verifiedUser, token, Client);
							break;
						case 'pos':
							execLogout(res, verifiedUser, token, Pos);
							break;
						default:
							res.sendStatus(400);
					}
				}
			})
		}
	};

	function execLogout(res, verifiedUser, token, Collection){
		Collection
			.update({'_id': verifiedUser._id},{"$pull": {'tokenList': token}})
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
	};

	return controller;

};