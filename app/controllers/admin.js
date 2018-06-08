
var randomstring = require("randomstring");

// Utils Auth 
const utils_auth = require("../../utils/auth.js");



module.exports = (app) => {

	const Admin 	= app.models.admin;
	const Category 	= app.models.category;
	const Pos 		= app.models.pos;
	const Order 	= app.models.order;

	var controller = {};

	//
	// Authentication 
	//
	
	controller.login = function(req, res) {

		const info = req.body.info;

		Admin
			.findOne({'id': info.id})
			.exec()
			.then(
				function(admin){
					// Not found (send 403 for security issues)
					if(!admin)
						res.sendStatus(403);

					// Compare passwd
					else if(!utils_auth.comparePasswords(info.passwd, admin.passwd))
						res.sendStatus(403);

					else {
						const token = randomstring.generate(40);

						Admin
							.update({'id': admin.id},{"$push": {"tokenList": token}})
							.exec()
							.then(
								function(){
									res.send({'token': token}).status(200)
								},
								function(err){
									console.log(err);
									res.sendStatus(500);
								}
							)
					}


				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)

	}

	controller.logout = function(req, res) {
		
		const token = req.headers['x-access-token'];

		Admin
			.update({'tokenList': token},{"$pull": {"tokenList": token}})
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
	}

	controller.checkLogedIn = function(req, res, next) {
		
		const token = req.headers['x-access-token'];

		Admin
			.find({'tokenList': token})
			.exec()
			.then(
				function(admins){
					if(admins.length)
						next();
					else
						res.sendStatus(403);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	}

	//
	// CATEGORY Control
	//

	controller.updateCategory = function(req, res) {
		const category = req.body.category;
		
		Category
			.update({id: category.id},{'$set': category}, {upsert: true})
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

	controller.deleteCategory = function(req, res) {
		const id = req.query.id;

		Category.deleteOne({id: id}, function(err){
			if(err) {
				console.log(err);
				res.sendStatus(500);
			}
			else{
				res.sendStatus(200);
			}
		})
	}

	controller.callCategories = function(req, res) {

		Category.find({}).sort({sort: 1, _id: 1}).exec().then(
			function(categoryList){
				res.send(categoryList);
			},
			function(err){
				console.log(err);
				res.sendStatus(500);
			}
		)
	}


	//
	//	POS Control
	//

	controller.createPos = function(req, res) {
		let pos = new Pos(req.body.pos);

		pos['scope'] 		 = 'pos';
		pos['open'] 		 = false;
		pos['deliveryPrice'] = 0;
		pos['isActive']  	 = false;
		pos['passwd'] 	 	 = utils_auth.generatePasswordHash(pos.passwd);
		pos['timeStamp'] 	 = new Date();

		pos.save(function(err){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			else{
				res.sendStatus(200);
			}
		})
	}

	// GET array with distinct citie names
	controller.distinctCities = function(req, res) {
		Pos
			.distinct('city')
			.exec()
			.then(
				function(cities){
					res.send(cities).status(200);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	}

	// GET Poss by city
	controller.getPossByCity = function(req, res) {
		const city = req.params.city;
		
		const filter = {
			id: true,
			name: true,
			image: true
		} 

		Pos
			.find({"city": city}, filter)
			.sort({"isActive": -1})
			.exec()
			.then(
				function(poss){
					res.send(poss).status(200);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	}

	// GET Pos by id
	controller.getPosById = function(req, res) {
		const id = req.params.id;

		const filter = {
			_id: false,
			__v: false,
			scope: false,
			passwd: false,
			tokenList: false,
			player_idList: false
		}

		Pos
			.findOne({id: id}, filter)
			.exec()
			.then(
				function(pos){
					res.send(pos).status(200);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	}

	// UPDATE Pos [isActive, Category]
	controller.updatePos = function(req, res) {
		const id  = req.params.id;
		const pos = req.body.pos;
		const values = {};

		if('isActive' in pos)
			values['isActive'] = pos.isActive;
		if('category' in pos)
			values['category'] = pos.category;
		if('orderRatio' in pos)
			values['orderRatio'] = pos.orderRatio;

		Pos
			.update({id: id},{'$set': values})
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
	}

	//
	// ORDERS control
	//

	controller.financialByMonth = function(req, res) {
		const pos_id = req.params.pos_id;
		const month  = req.params.month;

		Order.aggregate([
			{
			  	"$project": {
					orderRatio: "$orderRatio",
					pos_id: "$pos_id",
					status: "$status",
					year: { $year: "$timeStamp" },
		           	month: { $month: "$timeStamp" },
		            amount: {$cond : [{$eq: ['$status', 'canceled']}, 0 , "$orderRatio"]},
		           	countValid: {$cond : [{$eq: ['$status', 'canceled']}, 0 , 1]},
		           	countInvalid: {$cond : [{$eq: ['$status', 'canceled']}, 1 , 0]}
			  	}
			},
			{
			  	"$match": {
			  		pos_id: pos_id,
					year: parseInt(month.split('-')[0]),
					month: parseInt(month.split('-')[1])
			  	}
			},
			{
				"$group": {
					_id: "$orderRatio",
					totalAmount: {$sum: "$amount"},
					countValid: {$sum: "$countValid"},
					countInvalid: {$sum: "$countInvalid"}
				}
			}
		],
		
			function(err, result){
				if(err){
					console.log(err);
					res.sendStatus(500);
				}
				else{
					res.send(result).status(200);
				}
			}
		)
	}

	return controller;

};