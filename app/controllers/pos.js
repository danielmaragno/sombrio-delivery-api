
var fs = require('fs');
var path = require('path');

module.exports = (app) => {

	// Models call
	var Pos = app.models.pos;


	var controller = {};

	controller.findPosPos = (req, res) => {
		let id = req.body.pos.id;

		const filter = {
			'_id': true,
			'id': true,
			'name': true,
			'cnpj': true,
			'address': true,
			'timeStamp': true,
			'deliveryPrice': true,
			'phone': true,
			'image': true,
			'formasPagamento': true,
			'operatingTime': true,
			'open': true,
			'slogan': true
		};

		findPos(res, id, filter);
	};

	// Update POS
	controller.updatePosPos = (req, res) => {
		var id = req.body.pos.id;

		// Filter Update fields
		var required_data = req.body.required_data;
		var data = {};

		if('deliveryPrice' in required_data)
			data['deliveryPrice'] = required_data['deliveryPrice'];
		if('formasPagamento' in required_data)
			data['formasPagamento'] = required_data['formasPagamento'];
		if('phone' in required_data)
			data['phone'] = required_data['phone'];
		if('operatingTime' in required_data)
			data['operatingTime'] = required_data['operatingTime'];
		if('slogan' in required_data)
			data['slogan'] = required_data['slogan'];
		
		if('open' in required_data)
			data['open'] = required_data['open'];

		Pos
			.update(
				{'id': id, 'isActive': true},
				{'$set': data}
			)
			.exec()
			.then(
				// OK
				() => {
					res.sendStatus(200);
				},
				// Fail
				(err) => {
					console.log(err);
					res.sendStatus(500);
				}
			)


	};

	controller.uploadImage = (req, res) => {
		const pos 		= req.body.pos;
		const image_blob 	= req.body.image_blob;

		Pos
			.update({'id': pos.id},{'$set': {'image': image_blob}})
			.exec()
			.then(
				// OK
				() => {
					res.sendStatus(200);
				},
				// Fail
				(err) => {
					console.log(err);
					res.sendStatus(500);
				}
			)

		res.sendStatus(200);
	}

	controller.finPossByCategory = (req, res) => {
		
		const city 		= req.params.city;
		const category  = req.query.category;

		const filter = {
			'id': true,
			'name': true,
			'address': true,
			'image': true,
			'deliveryPrice': true,
			'operatingTime': true,
			'phone': true,
			'open': true,
			'category': true,
			'slogan': true
		};

		Pos
			.find(
				{city: city, category: category, isActive: true, isOn: true},
				filter
			)
			.sort({"open": -1})
			.exec()
			.then(
				(poss) => {
					res.status(200).send(poss);
				},
				(err) => {
					console.log(err);
					res.sendStatus(500);
				}
			)
	};

	controller.pushPlayerId = (req, res) => {
		const id 		= req.body.pos.id;
		const player_id = req.body.player_id;

		Pos
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

	controller.findSpecificPosClient = (req, res) => {

		let id = req.params.id;

		const filter = {
			'id': true,
			'name': true,
			'address': true,
			'image': true,
			'deliveryPrice': true,
			'formasPagamento': true,
			'operatingTime': true,
			'phone': true,
			'open': true,
			'category': true,
			'slogan': true
		};

		findPos(res, id, filter);

	};

	//
	// Support Functions
	//

	function findPos(res, id, filter){
		Pos
			.findOne(
				{'id': id, 'isActive': true}, 
				filter
			)
			.exec()
			.then(
				// Ok
				(poss) => {
					res.status(200).send(poss);
				},
				// Fail
				(err) => {
					console.log(err);
					res.sendStatus(500);
				}
			)

	};


	return controller;

}