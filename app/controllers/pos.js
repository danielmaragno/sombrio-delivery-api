

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
			'open': true
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
			'category': true
		};

		Pos
			.find(
				{city: city, category: category, isActive: true},
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
			'category': true
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