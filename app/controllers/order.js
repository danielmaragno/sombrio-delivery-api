

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

		let items_list = req.body.items_list;
		if(!items_list) res.sendStatus(400);

		else{

			const pos 		= req.body.pos;
			const client 	= req.body.client;
			let order 	    = req.body.order;

			order.deliveryPrice  = pos.deliveryPrice;
			order.pos_id 		 = pos.id;
			order.client_id 	 = client.id;
			order.client_name 	 = client.name;
			order.client_address = client.address;
			
			Item.findOne({"pos_id": pos.id}).exec().then(

				(item) => {
					if(!item)
						res.sendStatus(404);

					else{

						const items = item.items;
						order.total_price = order.deliveryPrice;
						order.total_items = 0;

						// create item map
						let item_map = {};
						for(let i=0, item; item=items[i++];){
							item_map[item._id] = item;
						}

						// Create Order[items] array
						let missIdFlag = false; // avoid non-zero exit code
						order.items = items_list.map(function(i){

							if((i._id in item_map) && !missIdFlag){
								order.total_price += (item_map[i._id].price * i.qtd);
								order.total_items += i.qtd;

								return {
									'name': item_map[i._id].name,
									'price_un': item_map[i._id].price,
									'qtd': i.qtd
								};
							}
							else {
								missIdFlag = true;
							}
						});

						if(missIdFlag)
							res.sendStatus(400);

						else{
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
					
					} // internal else


				} // item find

			) // then

		} // external else

	};

	//
	//	POS requests
	//

	controller.callOrders = function(req, res){
		const pos = req.body.pos;
		const timeStamp = new Date(parseInt(req.query.timeStamp));
		
		let query = {
			"pos_id": pos.id,
			"timeStamp": { "$gt": timeStamp }
		};

		if(req.query.date){
			const date = new Date(parseInt(req.query.date));
			
			query['timeStamp'] = {
				"$gte": (new Date(date)).setHours(0,0,0,0),
				"$lte": (new Date(date)).setHours(23,59,59,999)
			}
		}

		const filter = {
			"_id": true,
			"timeStamp": true,
			"client_name": true,
			"total_items": true,
			"status": true
		}

		Order
			.find(query, filter)
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

	controller.callSingleOrder = function(req, res) {
		const pos_id 	= req.body.pos.id;
		const order_id  = req.params.order_id;

		Order
			.findOne({'_id': order_id, 'pos_id': pos_id})
			.exec()
			.then(
				function(order){
					res.status(200).send(order);
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
			.update(
				{"_id": id, "pos_id": pos.id},
				{"$set": {"status": data.status, "pos_comentario": data.pos_comentario}}
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

	controller.getClientOrders = function(req, res){
		const client_id = req.body.client.id;

		const filter = {
			"_id": true,
			"status": true,
			"total_price": true,
			"timeStamp": true,
			"total_items": true,
			"items": true,
			"pos_comentario": true
		}

		Order
			.find({"client_id": client_id}, filter)
			.sort({"timeStamp": -1})
			.limit(10)
			.exec()
			.then(
				function(orders){
					res.status(200).send(orders);
				},
				function(err){
					console.log(err);
					res.sendStatus(500)
				}
			)
	};

	return controller;

};