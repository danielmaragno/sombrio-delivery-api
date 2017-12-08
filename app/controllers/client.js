

// Utils Auth 
const utils_auth = require("../../utils/auth.js");

module.exports = (app) => {

	const Client = app.models.client;

	var controller = {};


	controller.createClient = function(req, res) {

		const newClient = req.body.client;

		if(newClient && 'passwd' in newClient){

			// Generate passwd hash
			newClient.passwd = utils_auth.generatePasswordHash(newClient.passwd);

			(new Client(newClient))
				.save()
				.then(
					function(data) {
						// console.log(data);
						res.sendStatus(200);
					},
					function(err){
						const error = err.errors;
						let error_code;

						// id already exists
						if('id' in error){
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
		var data = {
			'address': required_data['address']
		};

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

	return controller;

};