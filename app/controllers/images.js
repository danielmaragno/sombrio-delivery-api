

module.exports = (app) => {

	const Images = app.models.images;

	let controller = {}

	controller.getImages = function(req, res){

		// const key = req.params.key;
		const key = req.query.key.trim();

		if(key){
			Images
				.find({'product': {'$regex': key, '$options': 'i'}},{product: true, url: true})
				.exec()
				.then(
					function(images){
						res.status(200).send(images);
					},
					function(err){
						console.log(err);
						res.sendStatus(500);
					}
				)
		}
		else {
			res.status(200).send([]);
		}

	}

	return controller;

}