

module.exports = (app) => {

	const Client = app.models.client;
	const Pos	 = app.models.pos;

	var controller = {};

	controller.checkLogin = (req, res, next) => {
		next();
	};

	controller.checkLoginPos = (req, res, next) => {
		
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else{
			Pos
				.findOne({"tokenList": token, "isActive": true})
				.exec()
				.then(
					function(pos){
						if(pos){
							req.body.pos = pos;
							next();
						}
						else
							res.sendStatus(401);
					},
					function(err){
						console.log(err);
						res.sendStatus(500);
					}
				)
		}
	};

	controller.checkLoginClient = (req, res, next) => {
		const token = req.headers['x-access-token'];

		if(!token)
			res.sendStatus(401);

		else{
			Client
				.findOne({"tokenList": token, "isActive": true})
				.exec()
				.then(
					function(client){
						if(client){
							req.body.client = client;
							next();
						}
						else
							res.sendStatus(401);
					},
					function(err){
						console.log(err);
						res.sendStatus(500);
					}
				)
		}
	};

	return controller;
}