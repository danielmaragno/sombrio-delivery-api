

module.exports = (app) => {

	// Models call
	var Pos = app.models.pos;


	var controller = {};

	controller.findPosPos = (req, res) => {
		let pos_id = req.body.pos.pos_id;

		const filter = {
			'_id': true,
			'pos_id': true,
			'name': true,
			'cnpj': true,
			'address': true,
			'timeStamp': true,
			'deliveryPrice': true
		};

		findPos(res, pos_id, filter);
	};

	// Update POS
	controller.updatePosPos = (req, res) => {
		var pos_id = req.body.pos.pos_id;

		// Filter Update fields
		var required_data = req.body.required_data;
		var data = {};

		if('deliveryPrice' in required_data)
			data['deliveryPrice'] = required_data['deliveryPrice'];

		
		Pos
			.update(
				{'pos_id': pos_id, 'isActive': true},
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

		let pos_id = req.params.pos_id;

		const filter = {
			'name': true,
			'address': true,
			'deliveryPrice': true
		};

		findPos(res, pos_id, filter);

	};

	//
	// Support Functions
	//

	function findPos(res, pos_id, filter){
		Pos
			.findOne(
				{'pos_id': pos_id, 'isActive': true}, 
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