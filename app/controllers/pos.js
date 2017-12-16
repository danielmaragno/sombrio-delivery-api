

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
			'image': true
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

	controller.findSpecificPosClient = (req, res) =>{

		let id = req.params.id;

		const filter = {
			'name': true,
			'address': true,
			'deliveryPrice': true
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