

// Utils Auth 
const utils_auth = require("../../utils/auth.js");
const utils_email = require("../../utils/email.js");

module.exports = (app) => {

	const Client = app.models.client;

	var controller = {};


	controller.createClient = function(req, res) {

		const newClient = req.body.client;
		
		if(newClient && 'passwd' in newClient){

			// Generate passwd hash
			newClient.passwd 			= utils_auth.generatePasswordHash(newClient.passwd);
			// Uses the same passwd hash just as pivot for account confirmation
			// confirmEmailHash will be deleted as soon as account was confirmed by the client
			newClient.confirmEmailHash	= newClient.passwd;
			
			(new Client(newClient))
				.save()
				.then(
					function(data) {
						// console.log(data);
						res.sendStatus(200);
						utils_email.sendConfirmEmail(newClient.id, newClient.confirmEmailHash);
					},
					function(err){
						const error = err.errors;
						let error_code;

						// id already exists
						if(error && 'id' in error){
							error_code = 'id_FAIL';
							res.status(400).send(error_code);
						}

						else
							res.sendStatus(500);
					}
				)
		}
		else
			res.sendStatus(500);

	};

	controller.findClient = function(req, res){

		const id = req.body.client.id;

		const filter = {
			'id': true,
			'name': true,
			'address': true
		}

		Client
			.findOne(
				{'id': id},
				filter

			)
			.exec()
			.then(
				function(client){
					res.status(200).send(client);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)

	};

	controller.updateClient = function(req, res){

		const id = req.body.client.id;

		const required_data = req.body.required_data;
		var data = {};

		if('address' in required_data){
			data['address'] = required_data['address'];
		}
		if('passwd' in required_data){
			data['passwd'] = utils_auth.generatePasswordHash(required_data['passwd']);
		}

		Client
			.update(
				{'id': id},
				{"$set": data} 
			)
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

	controller.pushPlayerId = function(req, res){
		
		const id 		= req.body.client.id;
		const player_id = req.body.player_id;

		Client
			.update(
				{'id': id},
				{'$addToSet': {'player_idList': player_id}}
			)
			.exec()
			.then(
				function() {
					res.sendStatus(200);
				},
				function(err) {
					console.log(err);
					res.sendStatus(500);
				}
			)
	}

	return controller;

};