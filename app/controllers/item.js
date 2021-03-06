

module.exports = (app) => {

	const Item = app.models.item;

	var controller = {};

	// POS and CLIENT request
	controller.callItemsByPos = function(req, res){

		const pos_id = req.params.pos_id;

		Item
			.findOne({"pos_id": pos_id})
			// .sort({"sort": 1})
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

	// POS requests

	// controller.createItem = function(req, res){
	// 	let newItem = req.body.item;

	// 	if(!newItem)
	// 		res.sendStatus(400);
	// 	else{
	// 		newItem.pos_id = req.body.pos.id;

	// 		(new Item(newItem))
	// 			.save()
	// 			.then(
	// 				function(data){
	// 					res.sendStatus(200);
	// 				},
	// 				function(err){
	// 					console.log(err);
	// 					res.sendStatus(500);
	// 				}
	// 			)

	// 	}

		
	// 	const item = new Item(req.body.item);

	// };

	// controller.removeItem = function(req, res){
	// 	const id 	 = req.params.id;
	// 	const pos_id = req.body.pos.id;

	// 	console.log(id);
	// 	console.log(pos_id);

	// 	Item
	// 		.remove({'_id': id, 'pos_id': pos_id})
	// 		.exec()
	// 		.then(
	// 			function(){
	// 				res.sendStatus(200);
	// 			},
	// 			function(err){
	// 				console.log(err);
	// 				res.sendStatus(500);
	// 			}
	// 		)
	// };

	controller.editItem = function(req, res){
		
		const pos_id = req.body.pos.id;
		const items = req.body.items;

		Item
			.update({'pos_id': pos_id}, {"$set": {'items': items}}, {upsert: true})
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