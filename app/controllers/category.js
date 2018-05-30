

module.exports = (app) => {

	// Call model
	const Category = app.models.category;

	var controller = {};

	controller.callCategories = function(req, res) {
		
		const filter = {
			_id: false,
			id: true,
			label: true,
			selfIcon: true
		}
		
		Category
			.find({}, filter)
			.sort({sort: 1, _id: 1})
			.exec()
			.then(
				function(categories){
					res.send(categories).status(200);
				},
				function(err){
					console.log(err);
					res.sendStatus(500);
				}
			)
	} 

	return controller;
}