

module.exports = function(app){

	const Order = app.models.order;
	const Item  = app.models.item;
	const Pos 	= app.models.pos;

	var controller = {};


	//
	// CLIENT requests
	//

	// CREATE 
	controller.findPos = function(req, res, next){
		const pos_id = req.params.pos_id;

		if(!pos_id)
			res.sendStatus(400);
		else
			Pos.findOne({"id": pos_id, "isActive": true}).exec().then(function(pos){
				if(!pos) res.sendStatus(400);
				else{
					req.body.pos = pos;
					next();
				} 
			});
	}

	controller.createOrder = function(req, res){

		let items_id_list = req.body.items_list;
		if(!items_id_list) res.sendStatus(400);

		else{
		
			const pos 		= req.body.pos;
			const client 	= req.body.client;
			let order 	    = req.body.order;

			order.deliveryPrice  = pos.deliveryPrice;
			order.pos_id 		 = pos.id;
			order.client_id 	 = client.id;
			order.client_name 	 = client.name;
			order.client_address = client.address;
			
			Item.find({"_id": {"$in": items_id_list}}).exec().then(

				(items) => {
					order.total_price = order.deliveryPrice;

					// create item map
					let item_map = {};
					for(let i=0, item; item=items[i++];){
						item_map[item._id] = item;
					}

					// Create Order[items] array
					order.items = items_id_list.map(function(i){
						
						order.total_price += item_map[i].price;

						return {
							'name': item_map[i].name,
							'price': item_map[i].price
						};
					});

					(new Order(order))
						.save()
						.then(
							function(){
								res.sendStatus(200);
							},
							function(err){
								console.log(err);
								res.sendStatus(500);
							}
						)

				}

			)

		} // else

	};

	//
	//	POS requests
	//

	controller.callOrders = function(req, res){
		const pos = req.body.pos;
		const timeStamp = new Date(parseInt(req.query.timeStamp));

		Order
			.find({"pos_id": pos.id, "timeStamp": {"$gt": timeStamp}})
			.sort({"timeStamp": -1})
			.exec()
			.then(
				function(orders){
					res.status(200).send(orders);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)

	};

	controller.updateStatus = function(req, res){

		const id  = req.params.order_id;
		const pos = req.body.pos;
		const data = req.body.data;

		Order
			.update({"_id": id, "pos_id": pos.id},{"$set": {"status": data.status}})
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