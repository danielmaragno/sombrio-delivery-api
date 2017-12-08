

module.exports = (app) => {

	const Item = app.models.item;

	var controller = {};

	// CLIENT requests
	controller.callItemsByPos = function(req, res){

		const pos_id = req.params.pos_id;

		const filter = {
			'_id': true,
			'name': true,
			'image': true,
			'price': true
		}

		Item
			.find({"pos_id": pos_id})
			.sort({"sort": 1})
			.exec()
			.then(
				function(items){
					res.status(200).send(items);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	};

	return controller;

};