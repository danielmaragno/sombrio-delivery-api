

module.exports = (app) => {

	const Client = app.models.client;

	var controller = {};


	controller.createClient = function(req, res) {

		const newClient = req.body.client;

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

					// username already exists
					if('username' in error){
						error_code = 'username_FAIL';
						res.status(400).send(error_code);
					}

					else
						res.sendStatus(500);
				}
			)
	};

	controller.findClient = function(req, res){

		const username = req.body.client.username;

		const filter = {
			'username': true,
			'name': true,
			'address': true
		}

		Client
			.findOne(
				{'username': username},
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

		const username = req.body.client.username;

		const required_data = req.body.required_data;
		var data = {
			'address': required_data['address']
		};

		Client
			.update(
				{'username': username},
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