
var randomstring = require("randomstring");

// Utils Auth 
const utils_auth = require("../../utils/auth.js");
const utils_email = require("../../utils/email.js");

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
			.findOne({'id': info.id, "isActive": true})
			.exec()
			.then(
				function(user){
					// Not found (send 403 for security issues
					if(!user)
						res.sendStatus(403);
					
					// Compare passwd
					else if(!utils_auth.comparePasswords(info.passwd, user.passwd))
						res.sendStatus(403);

					// LoginOK
					else{
						const token = utils_auth.generateToken(user);
						const userToSend = {
							'id': user.id,
							'name': user.name,
							'deliveryPrice': 'deliveryPrice' in user ? user.deliveryPrice : null,
							'address': 'address' in user ? user.address : null,
							'image': 'image' in user ? user.image : null
						}
						Collection
							.update({'_id': user._id},{'$push': {'tokenList': token}})
							.exec()
							.then(
								function(){
									res.status(200).send({'token': token, 'user': userToSend})
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
		const token 	 = req.headers['x-access-token'];
		const player_id  = req.query.player_id;

		if(!token)
			res.sendStatus(404);

		else{
			utils_auth.decodeToken(token, function(err, verifiedUser){
				if(err){
					console.log(err);
					res.sendStatus(500);
				}
				else{
					switch(verifiedUser.scope){
						case 'client':
							execLogout(res, verifiedUser, {'tokenList': token, 'player_idList': player_id}, Client);
							break;
						case 'pos':
							execLogout(res, verifiedUser, {'tokenList': token}, Pos);
							break;
						default:
							res.sendStatus(400);
					}
				}
			})
		}
	};

	function execLogout(res, verifiedUser, pullData, Collection){
		Collection
			.update({'_id': verifiedUser._id},{"$pull": pullData})
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

	//
	//	Confirm Account
	//

	controller.confirmAccount = function(req, res){
		
		const confirmEmailHash = req.query.code;

		Client
			.findOneAndUpdate(
				{"confirmEmailHash": confirmEmailHash},
				{"$set": {"isActive": true}, "$unset": {"confirmEmailHash": true}},
				
				function(err, client){
					if(!err && client) {
						let message  = "Parabéns, sua conta foi confirmada.\n";
							message += "Aproveite o maior portal de entregas da sua cidade.\n\n";
							message += "Faça o login e boas compras :D\n\n\n";
							message += "Equipe Santa Catarina Delivery";

						res.status(200).send(message);
					}
					else {
						res.sendStatus(401);
					}
				}
			)
	}

	controller.recoveryPasswd = function(req, res){

		const id = req.query.id;

		const newPasswd 	= randomstring.generate(8);
		const newPasswdHash = utils_auth.generatePasswordHash(newPasswd);

		Client
			.findOneAndUpdate(
				{'id': id},
				{'$set': {passwd: newPasswdHash}},

				function(err, client) {
					if(err){
						console.log(err);
						res.sendStatus(500);
					}
					else if(!client){
						res.sendStatus(404);
					}
					else {
						res.sendStatus(200);
						utils_email.sendPasswdRecovyEmail(id, newPasswd);
					}
				}
			)


	}

	return controller;

};